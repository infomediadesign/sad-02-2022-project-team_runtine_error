const express = require("express")
const cors = require('cors');
const app = express();
app.use(express.json());
// app.use(cors());
app.use(express.static('www'));
require('dotenv').config();
const jwt = require('jsonwebtoken');
const neo = require('neo4j-driver');
const bcrypt = require('bcrypt');
const Joi  = require('joi');

const validation = (req,res,next)=>{
    const schema = Joi.object({
        username: Joi.string().required().min(5).max(8),
        password: Joi.string().alphanum().required().min(6).max(12),
        //repeat_password: Joi.ref('password'),
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        lat:Joi.number(),
        lon: Joi.number(),
        gender: Joi.string().max(1).required()       
    })
    const {error} = schema.validate(req.body);
    if(error) return res.send(error.details[0].message);
    next();
}
const driver = neo.driver('bolt://localhost:7687',neo.auth.basic('neo4j','admin'));

async function testconn(){
    const session = driver.session();
    const resp = await session.run('MATCH (p) RETURN (p)');
    const allRecords=[];
    resp.records.forEach(rec=>allRecords.push(rec._fields[0].properties.name));
    console.table(allRecords);
    session.close();
}

testconn();

app.listen(3000);
let token_secret = process.env.TOKEN_SECRET;

app.post('/register',validation ,async (req,res)=>{
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;
    const lat = req.body.lat;
    const lon = req.body.lon;
    const gender = req.body.gender;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password,salt);
    const ses = driver.session();
    const existingCheck = await ses.run(`MATCH (P:Person) WHERE P.email='${email}' or P.username = '${username}' RETURN (P.username), (P.email)`);
    if(existingCheck.records.length>0){
        console.log(existingCheck.records[0]._fields);
        if(existingCheck.records[0]._fields[0]===req.body.username)
        return res.send('Username already in use.');
        else
        return res.send('Email id already in use.');
    }
    const newUser = await ses.run(`CREATE (P:Person{name:"${name}", username:"${username}",
    password:"${hashedPassword}", email:"${email}", gender:"${gender}", lat:${lat}, lon:${lon} })`)
    console.log(newUser);
    ses.close();
    res.send('New user created');
})

app.post('/findbyinterest',async(req,res)=>{
    const interests = req.body.interests;
    const intArr =[];
    let queryInt = `I.name = '${interests[0]}'`;
    if (interests.length > 1){
        for(let i=1;i<interests.length;i++){
            queryInt = queryInt+` OR I.name = '${interests[i]}'`;
        }
    }
    const finalQuery = `MATCH (P:Person)-[:Interested] ->(I:Interest) WHERE ${queryInt} RETURN (P.name),(I.name)`;
    const session = driver.session();
    const reply = await session.run(`${finalQuery}`);
    reply.records.forEach(record=>intArr.push(record._fields));
    session.close();
    res.send(intArr);
})


app.post('/interests',async (req,res)=>{
    const interestArray=[];
    const name = req.body.name;
    const interestedIn = req.body.interest;
    const ses = driver.session();
    const resp = await ses.run(`MATCH(I:Interest) RETURN (I)`);
    resp.records.forEach(rec=>interestArray.push(rec._fields[0].properties.name));
    const intPresent = interestArray.findIndex(rec=>rec===interestedIn);
    if(intPresent===-1){
        const newInterest = await ses.run(`CREATE (I:Interest{name:'${interestedIn}'}) RETURN (I)`);
        console.log(newInterest);
    }
    const intUpdate = await ses.run(`MATCH (P:Person{username:'${name}'}),
    (I:Interest{name:'${interestedIn}'}) CREATE (P)-[:Interested]->(I)`);
    ses.close();
    console.log(intUpdate);
    return res.send('Created');
})


app.post('/personsinterests',async(req,res)=>{
    const person = req.body.person;
    const session = driver.session();
    const response=[];
    const interests = await session.run(`MATCH(P:Person{username:'${person}'}) - [:Interested] -> (I:Interest) RETURN (I)`);
    interests.records.forEach(record=> response.push(record._fields[0].properties.name));
    return res.send(`${person} is interested in: ${response}`);
})

// app.get('/loggedcheck',(req,res)=>{
//     console.log(req.headers);
//     const check = req.headers.auth_token;
//     const verified = jwt.verify(check, process.env.TOKEN_SECRET);
//     console.log(verified);
//     const loggedUSer = users.find(user=>user.username===verified.username);
//     //console.log(loggedUSer);
//     res.write(`${loggedUSer.username} logged in!`);
// })
// app.post('/login',(req,res)=>{
//     console.log(req.body);

//     users.find(user=>user.username===req.body.username)
//     if(req.body.username ==='banerjab' && req.body.password === 'abcd'){
//         let username = req.body.username;
//     const token = jwt.sign({username},token_secret);
//     // res.sendFile(__dirname+'/www/logged.html')
//     return res.header('auth-token', token).send('logged.html');
//     }
// })