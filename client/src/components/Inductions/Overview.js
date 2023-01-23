import axios from 'axios';
import JoditEditor from 'jodit-react';
import React, { useEffect, useRef, useState } from 'react';
import { SERVER_URL } from '../../EditableStuff/Config';
import Error from '../Error';
import Loading from '../Loading';
import './Inductions.css';

const Overview = ({props}) => {
  const editor = useRef(null);
  const [ preview, setPreview ] = useState(true);
  const [ overview, setOverview ] = useState();
  const [ load, setLoad ] = useState(0);
  const [ desc, setDesc ] = useState('');
  const getOverview = () => {
    axios.get(`${SERVER_URL}/getOverview/${props.c.url}`)
    .then(data=>{
      if(data.status===200){
        setOverview(data.data);
        setDesc(data.data.description);
        setLoad(1);
      }
      else{
        setLoad(-1);
      }
    })
  }
  useEffect(()=>{
    getOverview();
    setPreview(true);
  },[props.c]);
  const handleValue = (value) => {
    setOverview({...overview,['description']:value});
  }
  const showPreview = ()=>{
    setPreview(true);
  }
  const showEdit = () => {
    setPreview(false);
  }
  const cancelIt = () => {
    setOverview({...overview,['description']:desc});
    setPreview(true);
  }
  const saveIt = () =>{
    axios.put(`${SERVER_URL}/editOverview/${overview._id}`,
    overview,
    {
      headers:{"Content-Type" : "application/json"}
    }
    );
    setPreview(true);
  }
  
  return (
    <>{load===0?<Loading />:load===1?
      <div className='overview-container'>
        <div className=''>
          <div className='row py-3'>
            <div className='col-sm-8'>
              <h5>Overview</h5>
            </div>
            <div className='col-sm-4 text-end'>
              {props.access?preview?
                  <button className='btn btn-outline-dark btn-sm mx-1' onClick={showEdit}>Edit</button>
                :
                  <>
                    <button className='btn btn-outline-dark btn-sm mx-1' onClick={showPreview}>Preview</button>
                    <button className='btn btn-outline-dark btn-sm mx-1' onClick={cancelIt}>Cancel</button>
                    <button className='btn btn-outline-dark btn-sm mx-1' onClick={saveIt}>Save</button>
                  </>
              :null}
            </div>
          </div>
          {preview?
            <div className=''>
              <p dangerouslySetInnerHTML={{ __html: overview.description }}></p>
            </div>
          :
            <JoditEditor name="content" ref={editor} value={overview.description} onChange={handleValue} /> 
          }
            </div>
      </div>
      :<Error />}
    </>
  )
}

export default Overview;