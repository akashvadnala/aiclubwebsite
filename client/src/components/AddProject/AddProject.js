import React, { useRef, useState, useMemo, useContext, useEffect } from 'react';
import './AddProject.css';
import JoditEditor from 'jodit-react';
import { Context } from '../../Context/Context';
import { NavLink, useNavigate } from 'react-router-dom';
import { editorConfig } from './Params/editorConfig';
import Error from '../Error';

const AddProject = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(Context);
    
  const [ add, setAdd ] = useState('Submit');
  const [ add2, setAdd2 ] =useState();
  const [xauthor,setXAuthor] = useState('');
  const [authorsCount,setAuthorsCount] = useState(1);
  const [ proj, setProj ] = useState({
    'title':'',
    'url':'',
    'authors':[user?user.username:''],
    'content':''
  })
  const handleValue = (e) => {
    setProj({...proj, ['content']:e});
    console.log('proj',proj);
  }
  const handleInputs = (e) => {
    setProj({...proj, [e.target.name]:e.target.value});
    console.log('proj',proj);
  }
  const removeXAuthor = (author) => {
    let current = proj.authors;
    current = current.filter(x => x!==author);
    setProj({...proj,['authors']:current});
    setXAuthor('');
    console.log('proj',proj);
  }
  const AddXAuthor = () => {
    let current = proj.authors;
    current.push(xauthor);
    setProj({...proj,['authors']:current});
    setXAuthor('');
    console.log('proj',proj);
  }
  const PostProject = () => {
    setAdd('Submitting ');
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);
  }
  console.log('proj',proj);
  return (
    <>
      {user?
        <div className='container addproject-container'>
          <div className='row'>
            <div className='col col-4'></div>
            <div className='col col-4'>
              <h3 className='my-3 text-center'>Add Project</h3>
            </div>
            <div className='col col-4'>
              <h6 className='my-3 text-end'>
                <NavLink to="#">Preview</NavLink>
              </h6>
            </div>
          </div>
              
                <form method="POST" onSubmit={PostProject} encType="multipart/form-data">
                  <div className='row'>
                    <div className='col col-9'>
                        <div className="form-group mb-1">
                          <label for="title">Project Title :</label>
                        </div>
                        <div className="form-group mb-4">
                          <input 
                            type='text' 
                            name="title" 
                            value={proj.title} 
                            onChange={handleInputs} 
                            className="form-control" 
                            id="title" 
                            aria-describedby="title" 
                            placeholder="Enter Project Title" 
                          required/>
                        </div>

                        <div className="form-group mb-1">
                          <label for="url">Project Url :</label>
                        </div>
                        <div className="form-group mb-4">
                          <input 
                            type='text' 
                            name="url" 
                            value={proj.url} 
                            onChange={handleInputs} 
                            className="form-control" 
                            id="url" 
                            aria-describedby="url" 
                            placeholder="Enter Project Url" 
                          required/>
                        </div>
                        
                        <div className="form-group my-1">
                          <label for="content">Project Content :</label>
                        </div>
                        <div className="form-group mb-4">
                          {/* {
                            useMemo( () => ( 
                              <JoditEditor name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> 
                            ),[proj.content])
                          } */}
                          <JoditEditor name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleValue} /> 
                          {/* <Jodit name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> */}
                        </div>
                        
                    </div>
                    <div className='col col-3'>
                        <div className="form-group my-1">
                          <label>Authors :</label>
                        </div>
                        {
                          (proj.authors).map(a => {
                            return(
                              <div className="form-group my-2 row">
                                <div className='col col-9'>
                                  <input 
                                      type='text' 
                                      value={a} 
                                      className="form-control" 
                                      id="author" 
                                      aria-describedby="title" 
                                    disabled/>
                                </div>
                                <div className='col col-3'>
                                {user.username!==a && <input type="reset" className='btn btn-danger' onClick={() => removeXAuthor(a)} value="Remove" />}
                                </div>
                              </div>
                            )
                          })
                        }
                        <div className="form-group my-2 row">
                          <div className='col col-9'>
                            <input 
                                type='text' 
                                name="xauthor" 
                                value={xauthor} 
                                onChange={(e) => setXAuthor(e.target.value)} 
                                className="form-control" 
                                id="authors" 
                                aria-describedby="authors" 
                                placeholder="Enter Project Title" 
                              />
                          </div>
                          <div className='col col-3'>
                            <input type="reset" className='btn btn-success' onClick={AddXAuthor} value="+Add" />
                          </div>
                          
                        </div>
                        <div>
                          <button type="submit" name="submit" id="submit" className="btn btn-primary my-3">{add}{add2}</button>
                        </div>
                    </div>
                  </div>
                </form>
        </div>
        :
        <Error />
        }
    </>
  )
}

export default AddProject;