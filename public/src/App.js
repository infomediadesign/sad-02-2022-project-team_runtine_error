import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chat from './components/Chat/Chat'
import Login from './components/Login/login'
import Register from './components/Register/register'
import SetAvatar from './components/SetAvatar/SetAvatar'
import './App.css'
import Logo from './Logo.jpg';

export default function App() {
    return (
        <div className="App">
        <h1 className='Name'>Chatterbox</h1>
        <img class="Logo" src={Logo} />
        
            <Routes>
                <Route path="/register" element= {<Register/>}/>
                <Route path="/" element= {<Login/>}/>
                <Route path="/setAvatar" element= {<SetAvatar/>}/>
                <Route path="/chat" element= {<Chat/>}/>
            </Routes>

        </div>

    )
}
