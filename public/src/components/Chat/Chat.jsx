import React,{useRef, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { allUsersRoute, localUser ,host} from '../../utils/APIRoutes';
import Contacts from './Contacts';
import Welcome from './Welcome';
import ChatContainer from './ChatContainer';
import Logout from '../../components/Logout/Logout';

import {io} from 'socket.io-client';


export default function Chat() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded,setIsLoaded] = useState(false);
    const socket = useRef();
    
    useEffect(()=>{
        var fnc3 = async function(){
            if (!localStorage.getItem("chatapp-user")) {
                navigate("/login");
            }
            else{
                const savedToken = localStorage.getItem("chatapp-user");
                const userDetails = axios.post(localUser, {
                    savedToken
                }); 
                const stringData = ((await userDetails).data);
                setCurrentUser (stringData);
                setIsLoaded(true);
            }
        };
        fnc3();
    },[])
    
    useEffect(()=>{
        var fnc6 = async function(){
            if(currentUser){
                socket.current= io(host);
                //^ again user id problem
                socket.current.emit("add-user",currentUser.id);
            }
        };
        fnc6();
    },[currentUser]);


    useEffect(()=>{
        var fnc2 = async function(){
            if(currentUser){
                if(currentUser.isAvatarImageSet){
                    const data = await axios.get(`${allUsersRoute}/${currentUser.username}`);
                    setContacts(data.data)
                }
                else{
                    navigate("/setAvatar");
                }
            }
        };
        fnc2();
    },[currentUser])
    
    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    
    return (
        <>
            <Container>
                <div className="container">
                    <div className='contact-container'>
                        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
                    </div>
                    <div>
                        {isLoaded && currentChat ===undefined?
                        (<Welcome currentUser={currentUser}/>): (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />)}
                    </div>
                </div>
            </Container>
        </>
    )
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: white;
    .container {
        height: 85vh;
        width: 85vw;
        background-color: white;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
        .contact-container{
        height:100vh;
    }
    }
    
`;
