require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const express = require('express');
const neo = require('neo4j-driver');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000,()=>{
    console.log('Started on port 5000');
});
const driver = neo.driver('bolt://localhost:7687',neo.auth.basic('neo4j','admin'));



app.post('/register', async(req,res)=>{
    console.log(req.body);
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
    console.log(passCheck);
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
    console.log(savedToken);
    const username = jwt.verify(savedToken, tokenSecret);
    console.log(username)
    const session = driver.session();
    const reply = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P)`);
    const user = reply.records[0]._fields[0].properties;
    console.log(user);
    session.close();
    delete user.password;
    return res.json(user);
})