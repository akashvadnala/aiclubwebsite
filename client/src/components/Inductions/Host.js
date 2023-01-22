import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../EditableStuff/Config';

const Host = ({props}) => {
  const navigate = useNavigate();
  const deleteCompete = async () =>{
    const confirmed = window.confirm(`Are you sure to delete the competition ${props.c.title}?`);
    if(confirmed){
      const res = await axios.post(`${SERVER_URL}/deleteCompete/${props.c._id}`);
      if(res.status===200){
        console.log('Compeition Deleted');
        navigate('/');
      }
      else{
        console.log('Competition Cannot be Deleted');
      }
    }
  }
  return (
    <>
        <button className='btn btn-sm btn-danger' onClick={deleteCompete}>Delete Competition</button>
    </>
  )
}

export default Host