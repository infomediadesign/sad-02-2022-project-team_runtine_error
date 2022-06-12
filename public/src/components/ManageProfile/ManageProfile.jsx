import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { allUsersRoute, localUser } from '../../utils/APIRoutes';
import LoggedInUser from '../ProfileHome/LoggedInUser';
import './ManageProfile.css';
import PersonalData from './PersonalData';
import ManageBio from './ManageBio';
import ManageInterests from './ManageInterests';
import ManagePhotos from './ManagePhotos';


export default function ManageProfile(){
    const [isPersonalData, setIsPersonalData] = useState(false);
    const [isBio, setIsBio] = useState(false);
    const [isPhotos, setIsPhotos] = useState(false);
    const [isInterests, setIsInterests] = useState(false);

    const Personal_data = event => {
        setIsPersonalData(current => !current);
        setIsBio(current => false);
        setIsPhotos(current => false);
        setIsInterests(current => false);
    };

    const Bio_data = event => {
        setIsBio(current => !current);
        setIsPersonalData(current => false);
        setIsPhotos(current => false);
        setIsInterests(current => false);
    };
    
    const Photo_data = event => {
        setIsBio(current => false);
        setIsPersonalData(current => false);
        setIsPhotos(current => true);
        setIsInterests(current => false);
    };

    const Interest_data = event => {
        setIsBio(current => false);
        setIsPersonalData(current => false);
        setIsPhotos(current => false);
        setIsInterests(current => true);
    }
    return(
        <>
        <div className='manageProfile'>
        <LoggedInUser />
        <button className='profileBtn1' onClick={Personal_data}>Personal Data</button>
        {isPersonalData && <PersonalData />}
        <button className='profileBtn2' onClick={Bio_data}>Bio</button>
        {isBio && <ManageBio />}
        <button className='profileBtn3'onClick={Photo_data}>Photos</button>
        {isPhotos && <ManagePhotos />}
        <button className='profileBtn4' onClick={Interest_data}>Interests</button>
        {isInterests && <ManageInterests />}
        </div>
        </>
    )

}