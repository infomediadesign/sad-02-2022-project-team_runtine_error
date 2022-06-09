require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const express = require('express');
const neo = require('neo4j-driver');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const socket = require('socket.io');
const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000,()=>{
    console.log('Started on port 5000');  
});
const driver = neo.driver('bolt://localhost:7687',neo.auth.basic('neo4j','admin'));



app.post('/register', async(req,res)=>{
    const {username, password, email, firstName, lastName, city} = req.body;
    const session = driver.session();
    const existingCheck = await session.run(`MATCH (P:Person) WHERE P.email='${email}' or P.username = '${username}' RETURN (P.username), (P.email)`);
    if(existingCheck.records.length>0){
        console.log(existingCheck.records[0]._fields);
        if(existingCheck.records[0]._fields[0]===req.body.username)
        return res.json({message:"Username already in use", status:false})
        else
        return res.json({message:"email already in use", status:false});
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password,salt);
    await session.run(`CREATE (P:Person{firstName:"${firstName}", lastName:"${lastName}", username: "${username}", city:"${city}", email:"${email}", password:"${hashedPassword}"})`);
    //await session.run(`CREATE (P:Person{username:"${username}", password:"${hashedPassword}", email:"${email}", address:"${address}"})`);
    const reply  = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P)`);
    const user = reply.records[0]._fields[0].properties;
    session.close();
    const token = jwt.sign(username, tokenSecret);
    user.token = token;
    delete user.password;
    return res.json({status:true, user});
})

app.post('/', async(req,res)=>{
    const {username, password} =req.body;
    const session = driver.session();
    const loginCreds = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P.password)`)
    if (loginCreds.records.length===0){
        return res.json({message:"Invalid username", status:false});
    }
    const hashedPassword = loginCreds.records[0]._fields[0];
    const passCheck = await bcrypt.compare(password,hashedPassword);
    if(!passCheck){
        return res.json({message:"Incorrect password", status:false});
    }
    const reply  = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P)`);
    const token = jwt.sign(username, tokenSecret);
    const user = reply.records[0]._fields[0].properties;
    session.close();
    user.token = token;
    delete user.password;
    return res.json({status:true, user});
})

app.post('/setAvatar/:id', async(req,res)=>{
    const username = req.params.id;
    const avatarImage = req.body.image;
    const session = driver.session();
    const reply = await session.run(`MATCH (P:Person{username:'${username}'}) SET P.isAvatarImageSet = true, P.avatarImage = '${avatarImage}' RETURN (P)`);
    const userData = reply.records[0]._fields[0].properties;
    session.close();
    return res.json({isSet:userData.isAvatarImageSet, image:userData.avatarImage});
})

app.get('/allusers/:id', async(req,res)=>{
    const username = req.params.id;
    const session = driver.session();
    const reply = await session.run(`MATCH (P:Person) WHERE P.username<>'${username}' RETURN (P)`);
    const users = [];
    for(let i=0;i<reply.records.length;i++){
        const userData = reply.records[i]._fields[0].properties;
        delete userData.password;
        users.push(userData);
    }
    session.close();
    //console.log(users);
    return res.json(users);
})

app.post('/getuser', async(req, res)=>{
    const {savedToken} = req.body;
    const username = jwt.verify(savedToken, tokenSecret);
    const session = driver.session();
    const reply = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P)`);
    const user = reply.records[0]._fields[0].properties;
    session.close();
    delete user.password;
    return res.json(user);
})

app.post('/dummy', async(req,res)=>{
    const {from, to} = req.body;
    const session = driver.session();
    const replyFrom = await session.run(`MATCH (P:Person{username:'${from}'}) RETURN ID(P)`);
    const replyTo = await session.run(`MATCH (P:Person{username:'${to}'}) RETURN ID(P)`);

    const fromID = replyFrom.records[0]._fields[0].low;
    const toID = replyTo.records[0]._fields[0].low;

    session.close();
    /*
    conversation table
    ------------------
    id int
    user1 int
    user2 int
    last_message datetime

    conversation_message
    ---------------------
    conversation_id int
    message_text text|varchar(255)|string
    sender_id int
    date  datetime
    */
    return res.json({fromID, toID});
});


const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

//? i don't know fromID  but we need to use userID
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(fromID)=>{
        onlineUsers.set(fromID,socket.id);
    });

    socket.on("send-message",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        //^If user is online
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("message-receive",data.message);
        }
    })
})


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(()=>{
        console.log("MongoDb connection Success");
    })
    .catch((err)=>{
        console.log(err.message);
});



// //^message model

// const messageSchema = new mongoose.Schema({
//     message: {
//         text: { type: String, required: true },
//     },
//     users: Array,
//     sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     },
//     //^ to sort messages
//     {timestamps: true,}
// )

// module.exports = mongoose.model("Users",messageSchema)


// //^ message route
// router.post("/addMsg/", addMessage);
// router.post("/getMsg/", getMessages);

// module.exports = router;

// //^ message controller
// module.exports.addMessage = async (req, res, next) => {
//     try {
//         const {from,to,messages} =req.body;
//         const data = await MessageModel.create({
//             message:{text:message},
//             users:[from,to],
//             //^ sequence 
//             sender:from,
//         });
//         if(data) return res.json({message:"Message added/saved successfully..."});

//     return res.json({message:"Message failed save to DB"});

//     } catch (err) {
//         next(err);
//     }
// };

// module.exports.getMessages = async (req, res, next) => {
//     try {
//         const {from,to} = req.body;
//         const messages = await messageModel.find({
//             users:{
//                 $all:[from,to]
//             },
//         }).sort({updatedAt: 1});
//         const projectMessages = messages.map((message)=>{
//             return{
//                 fromSelf: message.sender.toString() ===from,
//                 message:message.message.text,
//             };
//         });
//         res.json(projectMessages);
//     } catch (err) {
//         next(err)
//     }
// };
