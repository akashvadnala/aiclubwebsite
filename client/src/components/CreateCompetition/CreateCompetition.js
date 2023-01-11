import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../EditableStuff/Config';
import Loading from '../Loading';
import Error from '../Error';

const CreateCompetition = () => {
  const navigate = useNavigate();
  // const { user } = useContext(Context);
  const [compete, setCompete] = useState({
    url:"",
    title:"",
    description:"",
    creator:"",
    access:[],
    public:true,
    navs:[]
  });
  const [load,setLoad] = useState(0);
  const [ xaccess,setXAccess ] = useState('');
  const getUser = async () =>{
    console.log('Hello');
    try{
      axios.get(`${SERVER_URL}/getUserData`,
      {withCredentials: true})
      .then(data=>{
        const user=data.data;
        console.log('user',user);
        if(user && (user.canCreateCompetitions || user.isadmin)){
          setCompete({...compete,['access']:[user.username],['creator']:user.username});
          setLoad(1);
        }
        else{
          setLoad(-1);
        }
      })
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getUser();
  },[]);
  
  const removeXAccess = (access) => {
    let current = compete.access;
    current = current.filter(x => x!==access);
    setCompete({...compete,['access']:current});
    setXAccess('');
  }
  const AddXAccess = () => {
    if(xaccess!==""){
      let current = compete.access;
      current.push(xaccess);
      setCompete({...compete,['access']:current});
      setXAccess('');
    }
  }

  let name, value;
  const handleInputs = (e) => {
      name = e.target.name;
      value = e.target.value;
      setCompete({...compete, [name]:value});
  }
  console.log('compete',compete);
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
    <>{load===0?<Loading />:load===1?
        <div className='createCompetition-container'>
            <div className='adjust'>
                <h3>Create Competition</h3>
                <form method="POST" onSubmit={createCompete} encType="multipart/form-data">
                  <div className="form-group my-3 row align-items-center">
                    <label for="title" className='col-sm-2 text-end'>Title :</label>
                    <div className='col-sm-10'>
                        <input type="text" name="title" value={compete.title} onChange={handleInputs} className="form-control" id="title" aria-describedby="title" placeholder={`Enter Competition title`} required/>
                    </div>
                  </div>
                  <div className="form-group my-3 row align-items-center">
                    <label for="description" className='col-sm-2 text-end'>Description :</label>
                    <div className='col-sm-10'>
                        {/* <input type="text" name="title" value={compete.title} onChange={handleInputs} className="form-control" id="title" aria-describedby="title" placeholder={`Enter Competition title`} /> */}
                        <textarea name="description" onChange={handleInputs} className="form-control" id="description" aria-describedby="description" value={compete.description} placeholder={`Enter Competition Description`} required>{compete.description}</textarea>
                    </div>
                  </div>
                  <div className="form-group my-3 row align-items-center">
                    <label for="url" className='col-sm-2 text-end'>Url :</label>
                    <div className='col-sm-10'>
                        <input type="text" name="url" value={compete.url} onChange={handleInputs} className="form-control" id="url" aria-describedby="url" placeholder={`Enter Competition url`} required/>
                    </div>
                  </div>
                  <div className="form-group my-3 row align-items-center">
                    <label className='col-sm-2 text-end'>Host Access :</label>
                    <div className='col-sm-10'>
                      <div className="form-group row">
                        {compete &&
                          (compete.access).map(a => {
                            return(
                                <div className='col-12 col-sm-6 col-lg-4 row'>
                                  <div className='col-8 paddr'>
                                    <input 
                                        type='text' 
                                        value={a} 
                                        className="form-control" 
                                        id="access" 
                                        aria-describedby="access" 
                                      disabled/>
                                  </div>
                                  <div className='col-4 paddl'>
                                    <input type="reset" className='btn btn-danger' onClick={() => removeXAccess(a)} value="Remove" />
                                  </div>
                                </div>
                            )
                          })
                        }
                          <div className='col-12 col-sm-6 col-lg-4 row'>
                            <div className='col-8 paddr'>
                              <input 
                                  type='text' 
                                  name="xaccess" 
                                  value={xaccess} 
                                  onChange={(e) => setXAccess(e.target.value)} 
                                  className="form-control" 
                                  id="accesses" 
                                  aria-describedby="accesses" 
                                  placeholder="Enter Username" 
                                />
                              </div>
                              <div className='col-4 paddl'>
                                <input type="reset" className='btn btn-success' onClick={AddXAccess} value="+Add" />
                              </div>
                          </div>
                      </div>
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
        :<Error />}
    </>
  )
}

export default CreateCompetition;