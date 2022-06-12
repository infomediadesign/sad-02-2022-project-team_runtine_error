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


export default function SettingsLinks(){
    const navigate = useNavigate();

    const [isAddConnection, setIsAddConnection] = useState(false);
    const [isRequests, setIsRequests] = useState(false);
    const [isManageProfile, setIsManageProfile] = useState(false);
    const [isEvents, setIsEvents] = useState(false);



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
        

        
    )
}

