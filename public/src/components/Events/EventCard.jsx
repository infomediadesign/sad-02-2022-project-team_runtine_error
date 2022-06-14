import React from "react";

const EventCard = ({event})=>{
    const navigate = useNavigate();
    var username;
    const [events, setEvents] = useState([]);
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
                const allEvents = await axios.get(EventListRoute);
                setFriends(allFriends.data.peopleArray);
                setIsLoaded(true);
            }
        };
        fnc3();

    },[])


    return(
        <div>
            <h4 style={{marginLeft:"-11rem", marginTop:"1rem"}}>{event.eventName}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{event.description}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{event.date}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{event.time}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{event.location}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{event.description}</h4>
            <h4 style={{marginLeft:"-5.5rem", marginTop:"-1.2rem"}}>{event.contact}</h4>
        </div>
        

    )
}
export default EventCard;