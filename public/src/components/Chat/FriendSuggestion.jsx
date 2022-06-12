import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { allUsersRoute, localUser } from '../../utils/APIRoutes';
import LoggedInUser from '../ProfileHome/LoggedInUser';
import { FriendSuggestionRoute } from '../../utils/APIRoutes';
import FriendCards from './FriendCards';
import './Styles.css'
export default function FriendSuggestion(){
    const navigate = useNavigate();
    var username;
    const [currentUser, setCurrentUser] = useState(undefined);
    const [friends, setFriends] = useState([]);
    const [isLoaded,setIsLoaded] = useState(false);
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
                username = stringData.username;
                setIsLoaded(true);
                const allFriends = await axios.post(FriendSuggestionRoute,{username});
                setFriends(allFriends.data.peopleArray);
                setIsLoaded(true);
            }
        };
        fnc3();

    },[])

    return(
        <>
        <LoggedInUser/>
        {friends.length>0? (<div className='Holder'>{friends.map((friend)=>(<div className='Friend'><FriendCards friend={friend}/></div>))}</div>):(<h1>No friends found</h1>)}
        </>
    )

}