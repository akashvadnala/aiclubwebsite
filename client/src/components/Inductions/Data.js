import axios from 'axios';
import JoditEditor from 'jodit-react';
import React, { useEffect, useRef, useState } from 'react';
import { SERVER_URL } from '../../EditableStuff/Config';
import Error from '../Error';
import Loading from '../Loading';
import './Inductions.css';

const Data = ({props}) => {
  const editor = useRef(null);
  const [ preview, setPreview ] = useState(true);
  const [ cdata, setCData ] = useState();
  const [ load, setLoad ] = useState(0);
  const [ desc, setDesc ] = useState('');
  const getCData = () => {
    axios.get(`${SERVER_URL}/getCData/${props.c.url}`)
    .then(data=>{
      if(data.status===200){
        setCData(data.data);
        setDesc(data.data.description);
        setLoad(1);
      }
      else{
        setLoad(-1);
      }
    })
  }
  useEffect(()=>{
    getCData();
    setPreview(true);
  },[props.c]);
  const handleValue = (value) => {
    setCData({...cdata,['description']:value});
  }
  const showPreview = ()=>{
    setPreview(true);
  }
  const showEdit = () => {
    setPreview(false);
  }
  const cancelIt = () => {
    setCData({...cdata,['description']:desc});
    setPreview(true);
  }
  const saveIt = () =>{
    axios.put(`${SERVER_URL}/editCData/${cdata._id}`,
    cdata,
    {
      headers:{"Content-Type" : "application/json"}
    }
    );
    setPreview(true);
  }
  
  return (
    <>{load===0?<Loading />:load===1?
      <div className='cdata-container'>
        <div className='border'>
          <div className='row p-3 pb-1'>
            <div className='col-sm-8'>
              <h5>Data</h5>
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
            <div className='p-3'>
              <p dangerouslySetInnerHTML={{ __html: cdata.description }}></p>
            </div>
          :
            <JoditEditor name="content" ref={editor} value={cdata.description} onChange={handleValue} /> 
          }
            </div>
      </div>
      :<Error />}
    </>
  )
}

export default Data;