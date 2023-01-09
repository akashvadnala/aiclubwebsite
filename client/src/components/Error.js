import React from 'react'
import image from '../EditableStuff/error404.jpg';

const Error = () => {
  return (
    <>
        <div className='text-center error-container'>
          <img src={image} alt="Error 404" />
        </div>
    </>
  )
}

export default Error