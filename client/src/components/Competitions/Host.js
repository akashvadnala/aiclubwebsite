import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../EditableStuff/Config';
import Error from '../Error';
import Loading from '../Loading';

const Host = ({ props }) => {
  const navigate = useNavigate();

  const deleteCompete = async () => {
    const confirmed = window.confirm(`Are you sure to delete the competition ${props.c.title}?`);
    if (confirmed) {
      const res = await axios.post(`${SERVER_URL}/deleteCompete/${props.c._id}`);
      if (res.status === 200) {
        console.log('Compeition Deleted');
        navigate('/');
      }
      else {
        console.log('Competition Cannot be Deleted');
      }
    }
  }

  const [load, setLoad] = useState(1);

  useEffect(()=>{
    if(props.access){
      setLoad(1);
    }
    else{
      setLoad(-1);
    }
  },[props])

  return (
    <>
      {load === 0 ? <Loading /> : load === 1 ?
        <>
          <div className='host-container py-2'>
            <div className='card'>
              <div className='p-3'>
                <h4 className='m-0'>Host</h4>
              </div>
              <div className='card-body border-top'>
                <button className='btn btn-sm btn-danger' onClick={deleteCompete}>Delete Competition</button>

              </div>
            </div>
          </div>
        </>
        : <Error />}
    </>
  )
}

export default Host