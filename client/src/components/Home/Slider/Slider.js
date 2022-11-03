import Carousel from 'react-bootstrap/Carousel';
import './Slider.css';
import React from 'react';

function Slider() {
  const slides = [
    {
        'imgsrc':'https://i2.wp.com/myblogs.pw/wp-content/uploads/2018/08/AI-Web.jpg?fit=1034%2C480&ssl=1',
        'caphead':'First slide label',
        'captext':'Nulla vitae elit libero, a pharetra augue mollis interdum.',
        'linktitle':'Inductions',
        'link':'/inductions'
    },
    {
      'imgsrc':'https://media.istockphoto.com/photos/artificial-intelligence-concept-picture-id1364859722?b=1&k=20&m=1364859722&s=170667a&w=0&h=o7emaeAZHOvBP1_o5ewQH9y9279rQWS9xO_xU4r-u-4=',
      'caphead':'First slide label',
      'captext':'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      'linktitle':'Inductions',
      'link':'/inductions'
    },
    {
      'imgsrc':'https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png',
      'caphead':'First slide label',
      'captext':'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      'linktitle':'Inductions',
      'link':'/inductions'
    }
  ]
  

  return (
    <Carousel>
      {
        slides.map((slide)=>{
          return(
            <Carousel.Item interval={5000}>
              <img
                className="d-block w-100"
                src={slide.imgsrc}
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>{slide.caphead}</h3>
                <p>{slide.captext}</p>
                <a href={slide.link}>{slide.linktitle}</a>
              </Carousel.Caption>
            </Carousel.Item>
          )
        })
      }
    </Carousel>
  );
}

export default Slider;