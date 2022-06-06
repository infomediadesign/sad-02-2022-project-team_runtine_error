import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { allUsersRoute } from '../../utils/APIRoutes';
import Contacts from './Contacts';
import Welcome from './Welcome';
import ChatContainer from './ChatContainer';


export default function Chat() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded,setIsLoaded] = useState(false);

    // useEffect(()=>{
    //     var fnc1 = async function(){
    //         if(!localStorage.getItem("chatapp-user")){
    //             navigate("/login");
    //         }
    //     };
    //     fnc1();
    // },[]);

    useEffect(()=>{
        var fnc3 = async function(){
            if (!localStorage.getItem("chatapp-user")) {
                navigate("/login");
            }
            else{
                const localU = await JSON.parse(localStorage.getItem("chatapp-user"));
                console.log(localU);
                setCurrentUser(await JSON.parse(localStorage.getItem("chatapp-user")));
                setIsLoaded(true);
            }
        };
        fnc3();
    },[])

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
                        (<Welcome currentUser={currentUser}/>): (<ChatContainer currentChat={currentChat}/>)}
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
