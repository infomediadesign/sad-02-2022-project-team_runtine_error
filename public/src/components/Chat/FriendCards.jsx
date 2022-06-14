import React from "react";

const FriendCards = ({friend})=>{
    return(
        <div>
            <img src={`data:image/svg+xml;base64,${friend.avatarImage}`} alt="" style={{height:"6.5rem", marginRight:"12rem", marginLeft:"3.3rem", marginTop:"10px"}} />
            <h4 style={{marginLeft:"-11rem", marginTop:"1rem"}}>{friend.firstName}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{friend.lastName}</h4>
        </div>
        

    )
}
export default FriendCards;