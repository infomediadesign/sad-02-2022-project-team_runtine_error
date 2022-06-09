import React,{useEffect, useState} from 'react'
import styled from 'styled-components'

export default function CurrentUser({currentUser}) {
    const [currentUserName, setCurrentUserName]= useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    
    useEffect(()=>{
        var fnc4 = async function(){
            //! ?contactlara ulasamiyorum neden anlamadim 
            //console.log(contacts);
            if(currentUser){
                setCurrentUserImage(currentUser.avatarImage);
                setCurrentUserName(currentUser.username);
            }
        };
        fnc4();
    },[currentUser]);

    return <>
        {currentUserImage && currentUserName &&
            (
                <Container>
                    <div className="content">
                    
                    <div className="current-user">
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="" />
                        </div>
                        <h1 className='currentUser'>{currentUserName}</h1>
                    </div>  
                    </div>
                     
                </Container>
            )
        }
    </>
}

const Container = styled.div`
position: absolute;
width: 342px;
height: 750px;
left: -3px;
top: -40px;
background: rgba(78, 136, 204, 0.5);
border-radius: 12px;
        img {
            height: 3rem;
            left:2px;
        }
        h3 {
            color: white;
            text-transform: uppercase;
        }
    }
    .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
        }
    }
    .selected {
        background-color: #9a86f3;
    }
    }
    .current-user {
    display:flex;
    margin-bottom: 20px;
    .avatar {
        img {
        height: 4rem;
        margin-left: 20%;
        margin-top: 5px;
        }
    }
}
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        gap: 0.5rem;
        .username {
        h2 {
            font-size: 1rem;
        }
        }
    }
    }
`;
