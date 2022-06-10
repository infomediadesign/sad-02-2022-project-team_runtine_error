import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { allUsersRoute, localUser } from '../../utils/APIRoutes';
import LoggedInUser from '../ProfileHome/LoggedInUser';
;

export default function ManageProfile(){

    const [currentUser, setCurrentUser] = useState(undefined);

    return(
        <>
        <h1>Manage Profile</h1>
        <LoggedInUser />
        </>
    )

}