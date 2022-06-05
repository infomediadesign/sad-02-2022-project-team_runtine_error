import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/login'
import Register from './pages/register'
import SetAvatar from './pages/SetAvatar'
import './App.css'

export default function App() {
    return (
        <div className="App">
        <h1>Chatterbox</h1>
        
            <Routes>
                <Route path="/register" element= {<Register/>}/>
                <Route path="/login" element= {<Login/>}/>
                <Route path="/setAvatar" element= {<SetAvatar/>}/>
                <Route path="/" element= {<Chat/>}/>
            </Routes>

        </div>

    )
}
