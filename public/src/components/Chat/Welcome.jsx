import React, { useState, useEffect } from "react";
import Robot from "../../assets/robot.gif";
import Logout from '../Logout/Logout';

export default function Welcome({currentUser}) {
    const [userName, setUserName] = useState("");

    useEffect(()=>{
        var fnc5 = async function(){
            
        };
        fnc5();
    },[]);

    return (
    <>
    <Logout />
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", color:"white", flexDirection:"column"}}>
        <img src={Robot} style={{height: "20rem", marginTop:"20%"}} alt="" />
        <h1 style={{color:"#1F5CA5", marginTop:"5%"}}>
            Welcome,  
        </h1>
       {/* <span style={{color:"black", marginTop:"20%"}}>{currentUser.userName}!</span> */} 
        <h3>Please select a chat to Start messaging.</h3>
        </div>
        </>
    );
}

/*const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    img {
        height: 25rem;
    }
    span {
        color: #4e0eff;
    }
`;*/