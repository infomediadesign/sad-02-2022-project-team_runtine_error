import {React, useState, useEffect} from "react";
import axios from "axios";
import {existingfrinedRoute} from '../../utils/APIRoutes'
const FriendCards = ({friend})=>{
    const [enableBtn, setEnableBtn] = useState(true);
    useEffect(()=>{
        var checkFriendship = async()=>{
            const reply = await axios.post(existingfrinedRoute, friend);
            console.log('hello');
        };
        checkFriendship();
    },[])
    return(
        <div>
            <img src={`data:image/svg+xml;base64,${friend.avatarImage}`} alt="" style={{height:"3.5rem", marginRight:"15rem", marginTop:"10px"}} />
            <h4>{friend.firstName}</h4><h4>{friend.lastName}</h4>
            <h4>{friend.username}</h4>
        </div>
    )
}
export default FriendCards;