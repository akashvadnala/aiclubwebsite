import Carousel from 'react-bootstrap/Carousel';
import './Slider.css';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../../EditableStuff/Config';

function Slider() {
  // const slides = [
  //   {
  //       'imgsrc':'https://i2.wp.com/myblogs.pw/wp-content/uploads/2018/08/AI-Web.jpg?fit=1034%2C480&ssl=1',
  //       'title':'Inductions For B20 and B21',
  //       'caption1':'AI CLUB Inductions for batch B20 and B21.',
  //       'caption2':'NITC',
  //       'linktitle':'Inductions',
  //       'link':'/competitions/ai-club-inductions'
  //   },
  //   {
  //     'imgsrc':'https://media.istockphoto.com/photos/artificial-intelligence-concept-picture-id1364859722?b=1&k=20&m=1364859722&s=170667a&w=0&h=o7emaeAZHOvBP1_o5ewQH9y9279rQWS9xO_xU4r-u-4=',
  //     'title':'Inductions For B20 and B21',
  //     'caption1':'AI CLUB Inductions for batch B20 and B21.',
  //     'caption2':'AI CLUB Inductions for batch B20 and B21.',
  //     'linktitle':'Inductions',
  //     'link':'/competitions/ai-club-inductions'
  //   },
  //   {
  //     'imgsrc':'https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png',
  //     'title':'Inductions For B20 and B21',
  //     'caption1':'AI CLUB Inductions for batch B20 and B21.',
  //     'linktitle':'Inductions',
  //     'link':'/competitions/ai-club-inductions',
  //     'color':'#99ff00'
  //   }
  // ]
  const [slides,setSlides] = useState([]);

  const getSlides = async () => {
    try{
        axios.get(`${SERVER_URL}/getSlides`)
        .then(data=>{
            if(data.status===200){
              setSlides(data.data);
            }
        })
    }catch(err){
        console.log(err);
    }
}

useEffect(()=>{
    getSlides();
},[]);

  return (
    <>
    <Carousel>
      {
        slides.map((slide)=>{
          return(
            <Carousel.Item interval={5000}>
              <img
                className="d-block w-100"
                src={slide.photo}
                alt="First slide"
              />
              <Carousel.Caption className='w-100 text-shadow' style={{color:slide.textcolor}}>
                <h1>{slide.title}</h1>
                <h6>{slide.caption1}</h6>
                <h5>{slide.caption2}</h5>
                {slide.link && <a className="mt-3 btn align-items-center" href={slide.link}>Learn More <span>❯</span></a>}
              </Carousel.Caption>
            </Carousel.Item>
            
          )
        })
      }
    </Carousel>
    </>
  );
}

export default Slider;