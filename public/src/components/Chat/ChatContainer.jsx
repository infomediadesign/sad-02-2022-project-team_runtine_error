import React from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import Logout from '../Logout/Logout';
import Messages from './Messages';

export default function ChatContainer({currentChat}) {
    //console.log(currentChat);
    const handleSendMessage = async (message)=>{};

return (
<>
    {
    currentChat && (
    <Container>
        <Logout />
        <div className="chat-header">
            <div className="user-details">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
                </div>
                <div className="username">
                    <h3>{currentChat.username}</h3>
                </div>
            </div>
            
            
        </div>
        <Messages/>
        <ChatInput handleSendMessage={handleSendMessage} />
    </Container>
    )
    }
</>
)
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
margin-top: ;

@media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
}

.chat-header {
    display: absolute;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: rgba(78, 136, 204, 0.1);
    height: 5rem;
    margin-top: 20px;

    .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 150px;
        .avatar {
            img {
                height: 6rem;
                margin-top: -10px;
            }
        }

        .username {
            h3 {
                color: black;
                margin-top: -52px;
            }
        }
    }
}

.chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 0.2rem;

        &-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }

    .message {
        display: flex;
        align-items: center;

        .content {
            max-width: 40%;
            overflow-wrap: break-word;
            padding: 1rem;
            font-size: 1.1rem;
            border-radius: 1rem;
            color: #d1d1d1;

            @media screen and (min-width: 720px) and (max-width: 1080px) {
                max-width: 70%;
            }
        }
    }

    .sended {
        justify-content: flex-end;

        .content {
            background-color: #4f04ff21;
        }
    }

    .recieved {
        justify-content: flex-start;

        .content {
            background-color: #9900ff20;
        }
    }
}
`;