import Carousel from 'react-bootstrap/Carousel';
import './Slider.css';
import React from 'react';

function Slider({slides}) {

  return (
    <>
    <div className='slides-home-container'>
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
    </div>
    
    </>
  );
}

export default Slider;