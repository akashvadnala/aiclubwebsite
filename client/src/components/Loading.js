import React from 'react';
import gif from '../EditableStuff/loading.webp';

const Loading = () => {
  return (
    <>
      <div className='text-center loading-container'>
        <img src={gif} alt="Loading.." />
      </div>
    </>
  )
}

export default Loading;