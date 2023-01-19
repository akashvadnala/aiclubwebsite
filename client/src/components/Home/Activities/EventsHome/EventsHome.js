import React,{useEffect, useState} from 'react';
import EventCardHome from './EventCardHome';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { SERVER_URL } from "../../../../EditableStuff/Config";


const EventsHome = () => {
    const [events,setEvents] = useState([]);
    const getEventData = async () => {
        try {
          axios.get(`${SERVER_URL}/events/gethomepageEvents`).then((data) => {
            const eventdata = data.data;
            console.log("data", eventdata);
            setEvents(eventdata);
          });
          console.log(events);
        } catch (err) {
          console.log(err);
        }
      };

    useEffect(()=>{
        getEventData();
    },[]);

    console.log(events)
    return (
            <div className='events-home-container'>
                <h4 className='header'>Events</h4>
                {
                    events.map((event,i)=>{
                    return(
                        <EventCardHome event={event} key={i}/>
                    )
                    })
                }
                <br></br>
                <p><NavLink to='/events'>Know More About Events<span className='small'> ❯</span></NavLink></p>
            </div>
    )
}

export default EventsHome