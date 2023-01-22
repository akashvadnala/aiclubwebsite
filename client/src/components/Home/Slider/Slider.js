import Carousel from 'react-bootstrap/Carousel';
import './Slider.css';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Slider() {
  const slides = [
    {
        'imgsrc':'https://i2.wp.com/myblogs.pw/wp-content/uploads/2018/08/AI-Web.jpg?fit=1034%2C480&ssl=1',
        'caphead':'Inductions For B20 and B21',
        'captext':'AI CLUB Inductions for batch B20 and B21.',
        'linktitle':'Inductions',
        'link':'/competitions/ai-club-inductions'
    },
    {
      'imgsrc':'https://media.istockphoto.com/photos/artificial-intelligence-concept-picture-id1364859722?b=1&k=20&m=1364859722&s=170667a&w=0&h=o7emaeAZHOvBP1_o5ewQH9y9279rQWS9xO_xU4r-u-4=',
      'caphead':'Inductions For B20 and B21',
      'captext':'AI CLUB Inductions for batch B20 and B21.',
      'linktitle':'Inductions',
      'link':'/competitions/ai-club-inductions'
    },
    {
      'imgsrc':'https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png',
      'caphead':'Inductions For B20 and B21',
      'captext':'AI CLUB Inductions for batch B20 and B21.',
      'linktitle':'Inductions',
      'link':'/competitions/ai-club-inductions'
    }
  ]
  

  return (
    <>
    <Carousel className='row'>
      {
        slides.map((slide)=>{
          return(
            <Carousel.Item interval={5000}>
              <img
                className="d-block w-100"
                src={slide.imgsrc}
                alt="First slide"
              />
              <Carousel.Caption className='w-100'>
                <h1>{slide.caphead}</h1>
                <h6>{slide.captext}</h6>
                <NavLink className="mt-3 btn align-items-center" to={slide.link}>Learn More <span>❯</span></NavLink>
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