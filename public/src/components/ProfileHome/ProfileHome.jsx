import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { allUsersRoute, localUser } from '../../utils/APIRoutes';
import './ProfileHome.css';
import ManageProfile from '../ManageProfile/ManageProfile';
import Requests from '../Requests/Requests';
import Events from '../Events/Events';

let stringData;
let isLoaded = false;


export default function ProfileHome(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);

    const [isAddConnection, setIsAddConnection] = useState(false);
    const [isRequests, setIsRequests] = useState(false);
    const [isManageProfile, setIsManageProfile] = useState(false);
    const [isEvents, setIsEvents] = useState(false);

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
                stringData = ((await userDetails).data);
                console.log(stringData.firstName);
                setCurrentUser (stringData);
                isLoaded = true;
                setCurrentUserImage(stringData.avatarImage);
            }
            
        };
        fnc3();
    },[])

    const add_connection_change = event => {
        setIsAddConnection(current => !current);
        setIsRequests(current => false);
        setIsManageProfile(current => false);
        setIsEvents(current => false);
    };

    const requests_change = event => {
        setIsAddConnection(current => false);
        setIsRequests(current => !current);
        setIsManageProfile(current => false);
        setIsEvents(current => false);
    };
    
    const manage_profile_change = event => {
        setIsAddConnection(current => false);
        setIsRequests(current => false);
        setIsManageProfile(current => !current);
        setIsEvents(current => false);
    };

    const events_change = event => {
        setIsAddConnection(current => false);
        setIsRequests(current => false);
        setIsManageProfile(current => false);
        setIsEvents(current => !current);
    }

    return(
        <div className='profileHome'>
            <div className='profile'>
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="" style={{height:"3.5rem", marginRight:"15rem", marginTop:"10px"}} />
            {isLoaded?(<h2>{stringData.firstName} {stringData.lastName}</h2>):(<h1>Not welcome</h1>)}
            <div className='profileButtons'>
                <button className='settings'>Settings</button>
                <button className='addConnection'>Your Connections</button>
            </div>
            <div className='settingsLinks'> 
            <button className='settingBtn1' onClick={add_connection_change}>Add Connection</button>
                {isAddConnection && <ManageProfile />}
            <button className='settingBtn2' onClick={requests_change}>Requests</button>
                {isRequests && <Requests />}
            <button className='settingBtn3'onClick={manage_profile_change}>Manage Profile</button>
                {isManageProfile && <ManageProfile />}
            <button className='settingBtn4' onClick={events_change}>Events</button>
                {isEvents && <Events />}
        </div>
        </div>
        </div>
        

        
    )
}

