const express = require("express")
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('www'));
require('dotenv').config();
const jwt = require('jsonwebtoken');
const neo = require('neo4j-driver');
const bcrypt = require('bcrypt');

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

app.post('/register',async (req,res)=>{
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
    const newUser = await ses.run(`CREATE (P:Person{name:"${name}", username:"${username}",
    password:"${hashedPassword}", email:"${email}", gender:"${gender}", lat:${lat}, lon:${lon} })`)
    console.log(newUser);
    ses.close();
    res.send('New user created');
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
    console.log(intUpdate);
    return res.send('Created');
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