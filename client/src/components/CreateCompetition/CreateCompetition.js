import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';

const CreateCompetition = () => {
  const navigate = useNavigate();
  const [compete, setCompete] = useState({
    url:"",
    title:"",
    description:"",
    public:true,
    navs:[]
  });
  // const { user } = useContext(Context);
  let user=null;
  const getUser = async () =>{
    const res = await axios.get(`${SERVER_URL}/getUserData`,
    {withCredentials: true});
    user = res.data;
    if(!user || !user.canCreateCompetitions){
      navigate('/');
    }
  }
  

  useEffect(()=>{
    getUser();
  },[]);

  let name, value;
  const handleInputs = (e) => {
      name = e.target.name;
      value = e.target.value;
      setCompete({...compete, [name]:value});
  }
  
  const [ add, setAdd ] = useState('Create');
  const [ add2, setAdd2 ] =useState();

  const createCompete = async (e) => {
    e.preventDefault();    
    setAdd('Creating ');
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);

    const competedata = await axios.post(`${SERVER_URL}/competitions`,
      compete,
      {
        headers:{"Content-Type" : "application/json"}
      }
    );
    console.log('competedata',competedata);
    if(competedata.status===201){
      navigate(`/competitions/${compete.url}`);
    }
    else{
    setAdd('Create ');
    setAdd2('');
    }
    
  }

  return (
    <>
        <div className='createCompetition-container'>
            <div className='adjust'>
                <h3>Create Competition</h3>
                <form method="POST" onSubmit={createCompete} encType="multipart/form-data">
                  <div className="form-group my-3 row">
                    <label for="title" className='col-sm-2 text-end'>Title :</label>
                    <div className='col-sm-10'>
                        <input type="text" name="title" value={compete.title} onChange={handleInputs} className="form-control" id="title" aria-describedby="title" placeholder={`Enter Competition title`} required/>
                    </div>
                  </div>
                  <div className="form-group my-3 row">
                    <label for="description" className='col-sm-2 text-end'>Description :</label>
                    <div className='col-sm-10'>
                        {/* <input type="text" name="title" value={compete.title} onChange={handleInputs} className="form-control" id="title" aria-describedby="title" placeholder={`Enter Competition title`} /> */}
                        <textarea name="description" onChange={handleInputs} className="form-control" id="description" aria-describedby="description" placeholder={`Enter Competition Description`} required>{compete.description}</textarea>
                    </div>
                  </div>
                  <div className="form-group my-3 row">
                    <label for="url" className='col-sm-2 text-end'>Url :</label>
                    <div className='col-sm-10'>
                        <input type="text" name="url" value={compete.url} onChange={handleInputs} className="form-control" id="url" aria-describedby="url" placeholder={`Enter Competition url`} required/>
                    </div>
                  </div>
                  <div className="form-group form-check my-3">
                        <input type="radio" name="public" checked={compete.public} onChange={(e)=>{setCompete({...compete, public:e.target.checked})}} className="form-check-input" id="public" />
                        <label class="form-check-label" for="public">Public</label>
                    </div>
                    <div className="form-group form-check my-3">
                        <input type="radio" name="private" checked={!compete.public} onChange={(e)=>{setCompete({...compete, public:!e.target.checked})}} className="form-check-input" id="private"/>
                        <label class="form-check-label" for="private">Invite Only</label>
                    </div>
                  <button type="submit" name="submit" id="submit" className="btn btn-primary">{add}{add2}</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default CreateCompetition;