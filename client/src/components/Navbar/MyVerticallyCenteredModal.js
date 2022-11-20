import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
  const [ username, setUsername ] = useState();
  const [ password, setPassword ] = useState();
  const [ signin, setsignin ] = useState('Sign in');
  const [ signin2, setsignin2 ] = useState();

  const Login = async (e) => {
    e.preventDefault();
    console.log('Logging..');
    setsignin(<i class="fa fa-spinner fa-spin"></i>)
    setsignin2('Signing in ');
    try{
      const log = await axios.post('http://localhost:5000/login',
      {
        'username':username,
        'password':password
      },
      {withCredentials: true}
      );
      if(log.status===400) console.log('Invalid Credentials');
      console.log(log);
    }catch(err){
      console.log('Login err','Invalid Credentials');
    }
    window.location.reload(true);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <h4>Login</h4>
        <div className='login-container'>
        <form onSubmit={Login} method="POST">
          <div class="form-group my-3 row">
              <label for="username" className='col-sm-4 text-end'>Username :</label>
              <div className='col-sm-8'>
                  <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} class="form-control" id="username" aria-describedby="username" placeholder="Enter Username or EMail ID" />
              </div>
          </div>
          <div class="form-group my-3 row">
              <label for="password" className='col-sm-4 text-end'>Password :</label>
              <div className='col-sm-8'>
                  <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} class="form-control" id="password" aria-describedby="password" placeholder="Enter Password" />
              </div>
          </div>
          <button type="submit" class="cust btn btn-primary btn-block mb-4">{signin2}{signin}</button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;