import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//^ axios for api calling && we can call fetch api by script
import axios from 'axios';
import { registerRoute } from "../../utils/APIRoutes";
import './register.css';
import Main from './Main.jpg';

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        city: "",
        password: "",
        confirmPassword: "",
    });
    const toastOptions={
        position:"bottom-right",
        autoClose:8000,
        pauseOnHover: true,
        theme:"dark",
    };

    //^ this is running olny first time the component is loaded
    useEffect(()=>{
        if(localStorage.getItem('chatapp-user')){
            //navigate('/')
        }
    },[]);

    const handleSubmit = async(event)=>{
        event.preventDefault();
        if(handleValidation()){
            const {password, username,email,address}=values;
            // console.log("in validation",registerRoute);
            const {data} = await axios.post(registerRoute,{
                username,email,password,address,
            });
            if(data.status === false){
                toast.error(data.message, toastOptions);
            }
            if(data.status === true){
                localStorage.setItem('chatapp-user',JSON.stringify(data.user));
                //& user to local storage and navigate to the chat container
                navigate("/Chat");
            }
        }
    };

    const handleValidation = ()=>{
        const {password,confirmPassword, username, email, city}= values;
        console.log("in validation",toast);
        if (password !== confirmPassword) {
            toast.error(
                "Password and confirm password should be same.",toastOptions
            );
            return false;
        }
        else if(username.length<3){
            toast.error(
                "Username should be greater than 3 characters.",toastOptions
            );
            return false;
        }
        else if(password.length<4){
            toast.error(
                "Password should be greater than 4 characters.",toastOptions
            );
            return false;
        }
        else if(email===""){
            toast.error("email is required",toastOptions);
            return false;
        }
        else if(city===""){
            toast.error("address is required",toastOptions);
            return false;
        }
        return true;
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    
    return (
        <>
        <img class="BackgroundImage" src={Main} />
            <div className="register">
                <h3>Register</h3>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <label>First Name</label>
                <input type="text" placeholder="First Name" name="firstName" onChange={(e) => handleChange(e)}/>
                <br></br>
                <label>Last Name</label>
                <input type="text" placeholder="Last Name" name="lastName" onChange={(e) => handleChange(e)}/>
                <br></br>
                <label>Username</label>
                <input type="text" placeholder="Username" name="username" onChange={(e) => handleChange(e)}/>
                <br></br>
                <label>City</label>
                <input type="text" placeholder="City" name="city" onChange={(e) => handleChange(e)}/>
                <br></br>
                <label>Email ID</label>
                <input type="email" placeholder="Email" name="email" onChange={(e) => handleChange(e)}/>
                <br></br>
                <label>Password</label>
                <input type="password" placeholder="password" name="password" onChange={(e) => handleChange(e)}/>
                <br></br>
                <label>Confirm Password</label>
                <input type="password" placeholder="confirm password" name="confirmPassword" onChange={(e) => handleChange(e)}/>
                <br></br>
                <button type="submit">Sign Up</button>
                <span>
                    Already have an account ? <Link to="/login">Login.</Link>
                </span>     
            </form>
            </div>     
        <ToastContainer />
        </>
    )
}


export default Register;