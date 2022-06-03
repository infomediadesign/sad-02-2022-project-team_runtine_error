require('dotenv').config();
const express = require('express');
const neo = require('neo4j-driver');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000,()=>{
    console.log('Started on port 5000');
});
const driver = neo.driver('bolt://localhost:7687',neo.auth.basic('neo4j','admin'));

const validation = (req,res,next)=>{
    const schema = Joi.object({
        username: Joi.string().required().min(5).max(8),
        password: Joi.string().alphanum().required().min(6).max(12),
        //repeat_password: Joi.ref('password'),
        email: Joi.string().email().required(),
        address: Joi.string().required()

    })
    const {error} = schema.validate(req.body);
    if(error) return res.send(error.details[0].message);
    next();
}




app.post('/register', async(req,res)=>{
    console.log(req.body);
    const {username, password, email, address} = req.body;
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
    await session.run(`CREATE (P:Person{username:"${username}", password:"${hashedPassword}", email:"${email}", address:"${address}"})`);
    const reply  = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P)`);
    const user = reply.records[0]._fields[0].properties;
    session.close();
    delete user.password;
    return res.json({status:true, user});
})

app.post('/login', async(req,res)=>{
    const {username, password} =req.body;
    const session = driver.session();
    const loginCreds = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P.password)`)
    if (loginCreds.records.length===0){
        return res.json({message:"Invalid username", status:false});
    }
    const hashedPassword = loginCreds.records[0]._fields[0];
    const passCheck = bcrypt.compare(password,hashedPassword);
    if(!passCheck){
        return res.json({message:"Incorrect password", status:false});
    }
    const reply  = await session.run(`MATCH (P:Person{username:'${username}'}) RETURN (P)`);
    const user = reply.records[0]._fields[0].properties;
    session.close();
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
    //console.log(users);
    return res.json(users);
})