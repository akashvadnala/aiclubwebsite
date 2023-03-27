import axios from "axios";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { SERVER_URL } from "../../EditableStuff/Config";

function TeamLogin(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [reset, setReset] = useState(false);
  const [signin, setsignin] = useState(false);
  const [msg, setMsg] = useState();
  const [showSpinner, setShowSpinner] = useState(false);

  const Login = async (e) => {
    e.preventDefault();
    setMsg("");
    setsignin(true);
    await axios
      .post(
        `${SERVER_URL}/login`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      ).then((res) => {
        window.location.reload(true);
      }).catch((err) => {
        console.log(err);
        setMsg(err.response.data.error);
        setsignin(false);
      });
  };

  const ResetPassword = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    setMsg("Sending Reset Password Link...");
    try {
      await axios
        .post(`${SERVER_URL}/forgot-password`, {
          username: username,
        })
        .then((res) => {
          // console.log("res", res);
          if (res.status === 401) {
            setMsg("User Not Found");
          } else if (res.status === 200) {
            setMsg("Reset Link sent your Mail (please also check the spam folder)");
          }
          setShowSpinner(false);
        });
    } catch (err) {
      setMsg(err.response.data.err);
    }
  };
  // console.log(reset);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Body className="text-center p-5">
        <h3 className="pb-4">{reset ? <>Reset Password</> : <>Login</>}</h3>
        {msg ? <div className="alert alert-danger">{msg}</div> : null}
        {!reset ? (
          <div className="login-container">
            <form method="POST">
              <div className="form-group mb-3 text-start">
                {/* <label for="username" className="pb-1">
                  Username/Email :
                </label> */}
                <div>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control py-2 px-4 rounded-pill"
                    id="username"
                    aria-describedby="username"
                    placeholder="Enter Username or EMail ID"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-3 text-start">
                {/* <label for="password" className="pb-1">
                  Password :
                </label> */}
                <div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control rounded-pill py-2 px-4 mb-4"
                    id="password"
                    aria-describedby="password"
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-4 py-2 px-4"
                onClick={Login}
                disabled={signin}
              >
                {signin?<>Signing in<i className="fa fa-spinner fa-spin"></i></>:<>Sign in</>}
              </button>
            </form>
            <button
              type="reset"
              className="cust btn text-primary"
              onClick={() => {
                setReset(!reset);
                setMsg("");
              }}
            >
              Forget Password?
            </button>
          </div>
        ) : (
          <div className="login-container">
            <form method="POST" onSubmit={ResetPassword}>
              <div className="form-group mb-4 text-start">
                {/* <label for="username" className="col-4 text-end">
                  Username/Email :
                </label> */}
                <div>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control rounded-pill py-2 px-4"
                    id="username"
                    aria-describedby="username"
                    placeholder="Enter Username or EMail ID"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="cust btn btn-primary w-100 mb-4 py-2 px-4"
              >
                Reset Password{
                  showSpinner && <i className="fa fa-spinner fa-spin"></i>
                }
              </button>
            </form>
            <button
              type="reset"
              className="cust btn mb-4"
              onClick={() => {
                setReset(!reset);
                setMsg("");
              }}
            >
              Back to Sign In
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default TeamLogin;
