import React,{useEffect, useState} from 'react';
import EventCardHome from './EventCardHome';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { SERVER_URL } from "../../../../EditableStuff/Config";

// const events=[
//     {
//         'name':'How ML has changed computing',
//         'speaker':'Dr. Aditya Bhaskara',
//         'status': 'upcoming',
//     },
//     {
//         'name':'The need of AI in robotics for Rehabilitation',
//         'speaker':'Dr. S M Mizanoor Rahman',
//         'status': 'upcoming'
//     },
//     {
//         'name':'Class-Agnostic Object Detection',
//         'speaker':'Dr. Ayush Jaiswal',
//         'status': 'ongoing'
//     },
//     {
//         'name':'AI in Healthcare and Life Science',
//         'speaker':'Mr. Raghav Mani',
//         'status': 'past'
//     },
//     {
//         'name':'The Basics of X-Vector-Based Automatic Speaker Verification',
//         'speaker':'Mr.Syed Shahnawazuddin',
//         'status': 'past'
//     }
// ]


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
                <p><NavLink to='/events'>Know More About Events<span className='small'> ❯</span></NavLink></p>
            </div>
    )
}

export default EventsHome