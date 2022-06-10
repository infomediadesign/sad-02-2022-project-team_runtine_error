import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { allUsersRoute, localUser } from '../../utils/APIRoutes';
import './ProfileHome.css';
import ManageProfile from '../ManageProfile/ManageProfile';
let stringData;
let isLoaded = false;


export default function ProfileHome(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);

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
            }
            
        };
        fnc3();
    },[])
    useEffect(()=>{
        var fnc4 = async function(){
            //! ?contactlara ulasamiyorum neden anlamadim 
            //console.log(contacts);
            if(currentUser){
                setCurrentUserImage(currentUser.avatarImage);
            }
        };
        fnc4();
    },[currentUser]);

    return(
        <div className='profileHome'>
            <div className='profile'>
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="" style={{height:"3.5rem", marginRight:"15rem", marginTop:"10px"}} />
            {isLoaded?(<h2>{stringData.firstName} {stringData.lastName}</h2>):(<h1>Not welcome</h1>)}
            <div className='profileButtons'>
                <button className='settings'>Settings</button>
                <button className='addConnection'>Add Connection</button>
            </div>
            <div className='settingsLinks'> 
            <Link to="/requests">Requests</Link> 
            <br></br>
            <Link to="/notifications">Notifications</Link><br></br>
            <Link to="/manageProfile">Manage Your Profile</Link><br></br>
            <Link to="/events">Events</Link>
            </div>
            </div>
            <div className='manageProfile'>
                <ManageProfile />

            </div>
            
        </div>
        

        
    )
}
