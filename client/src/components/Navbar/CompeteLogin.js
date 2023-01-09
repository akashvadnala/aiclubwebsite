import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { SERVER_URL } from '../../EditableStuff/Config';

function CompeteLogin(props) {
  const [ username, setUsername ] = useState();
  const [ password, setPassword ] = useState();
  const [ signin, setsignin ] = useState('Sign in');
  const [ signin2, setsignin2 ] = useState();
  const [ msg, setMsg ] = useState();
  const Login = async (e) => {
    e.preventDefault();
    console.log('Logging..');
    setMsg('');
    setsignin(<i class="fa fa-spinner fa-spin"></i>)
    setsignin2('Signing in ');
    try{
      await axios.post(`${SERVER_URL}/competelogin`,
      {
        'username':username,
        'password':password
      },
      {withCredentials: true}
      ).then(res => {
        console.log('res',res);
        if(res.status===200){
          setMsg('Invalid Credentials');
          setsignin('')
          setsignin2('Sign in ');
          console.log('Invalid Credentials');
        }
        else if(res.status===201){
          window.location.reload(true);
        }
      });
    }catch(err){
      setsignin('')
      setsignin2('Sign in ');
      setMsg()
      console.log('Login err','Invalid Credentials');
    }
  }
  return (
    <>
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <h4 className='pb-3'>Login <span className='h5'>(Competition)</span></h4>
        {msg?<div className='alert alert-danger'>{msg}</div>:null}
        <div className='login-container'>
        <form onSubmit={Login} method="POST">
          <div class="form-group my-3 row">
              <label for="username" className='col-4 text-end'>Username :</label>
              <div className='col-8'>
                  <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} class="form-control" id="username" aria-describedby="username" placeholder="Enter Username or EMail ID" required/>
              </div>
          </div>
          <div class="form-group my-3 row">
              <label for="password" className='col-4 text-end'>Password :</label>
              <div className='col-8'>
                  <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} class="form-control" id="password" aria-describedby="password" placeholder="Enter Password" required/>
              </div>
          </div>
          <button type="submit" class="cust btn btn-primary btn-block mb-4">{signin2}{signin}</button>
          </form>
          <p>No Account for Competitions? <a href='/signup'>Create Yours</a></p>
        </div>
      </Modal.Body>
    </Modal>
    </>
  );
}

export default CompeteLogin;