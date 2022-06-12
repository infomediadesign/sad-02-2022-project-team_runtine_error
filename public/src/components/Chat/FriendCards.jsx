import React from "react";

const FriendCards = ({friend})=>{
    return(
        <div>
            <img src={`data:image/svg+xml;base64,${friend.avatarImage}`} alt="" style={{height:"3.5rem", marginRight:"15rem", marginTop:"10px"}} />
            <h4>{friend.firstName}</h4>
            <h4>{friend.lastName}</h4>
            <h4>{friend.email}</h4>
        </div>
    )
}
export default FriendCards;