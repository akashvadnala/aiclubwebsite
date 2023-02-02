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
  const [showSpinner,setShowSpinner] = useState(false);

  const Login = async (e) => {
    e.preventDefault();
    console.log("Logging..");
    setMsg("");
    setsignin(true);
    try {
      await axios
        .post(
          `${SERVER_URL}/login`,
          {
            username: username,
            password: password,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          if (res.status === 200) {
            setMsg("Invalid Credentials");
            setsignin(false);
            console.log("Invalid Credentials");
          } else if (res.status === 201) {
            window.location.reload(true);
          }
        });
    } catch (err) {
      setsignin(true);
      setMsg();
      console.log("Login err", "Invalid Credentials");
    }
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
      console.log("Login err", err);
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
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {!reset ? (
          <h4 className="pb-3">Login</h4>
        ) : (
          <h4 className="pb-3">Reset Password</h4>
        )}
        {msg ? <div className="alert alert-danger">{msg}</div> : null}
        {!reset ? (
          <div className="login-container">
            <form method="POST">
              <div class="form-group my-3 row">
                <label for="username" className="col-4 text-end">
                  Username/Email :
                </label>
                <div className="col-8">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    class="form-control"
                    id="username"
                    aria-describedby="username"
                    placeholder="Enter Username or EMail ID"
                    required
                  />
                </div>
              </div>
              <div class="form-group my-3 row">
                <label for="password" className="col-4 text-end">
                  Password :
                </label>
                <div className="col-8">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="form-control"
                    id="password"
                    aria-describedby="password"
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>
              {signin ? (
                <button
                  type="submit"
                  class="cust btn btn-primary btn-block mb-4"
                  disabled
                >
                  Signing in<i class="fa fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  class="cust btn btn-primary btn-block mb-4"
                  onClick={Login}
                >
                  Sign in
                </button>
              )}
            </form>
            <button
              type="reset"
              class="cust btn btn-danger btn-block mb-4 mx-4"
              onClick={() => {
                setReset(!reset);
                setMsg("");
              }}
            >
              Forget Password
            </button>
          </div>
        ) : (
          <div className="login-container">
            <form method="POST">
              <div class="form-group my-3 row">
                <label for="username" className="col-4 text-end">
                  Username/Email :
                </label>
                <div className="col-8">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    class="form-control"
                    id="username"
                    aria-describedby="username"
                    placeholder="Enter Username or EMail ID"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                class="cust btn btn-primary btn-block mb-4"
                onClick={ResetPassword}
              >
                Reset Password{
                  showSpinner && <i class="fa fa-spinner fa-spin"></i>
                }
              </button>
            </form>
            <button
              type="reset"
              class="cust btn btn-danger btn-block mb-4 mx-4"
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
