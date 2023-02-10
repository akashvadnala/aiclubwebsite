import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";

function ForgetPassword() {
  const params = new useParams();
  const navigate = useNavigate();
  const id = params.id;
  const token = params.token;
  const [password, setPassword] = useState();
  const [cpassword, setCPassword] = useState();
  const [verified, setVerified] = useState(false);
  const [reset, setReset] = useState("Reset Password");
  const [reset2, setReset2] = useState();
  const [msg, setMsg] = useState();

  const Authenticate = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/reset-password/${id}/${token}`
      );
      if (res.status === 200) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Authenticate();
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      setMsg("Confirm Password not matching Password");
      return;
    } else {
      setMsg("");
      setReset("Changing Password ");
      setReset2(<i className="fa fa-spinner fa-spin"></i>);
      try {
        const res = await axios.put(
          `${SERVER_URL}/reset-password/${id}/${token}`,
          { password: password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true 
          }
        );
        if (res.status === 200) {
          setReset2("");
          setReset("Reset Password");
          navigate("/");
          window.location.reload(true);
        } else {
          setMsg("Something went wrong! Please try after sometime");
          navigate("/");
          window.location.reload(true);
        }
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  return (
    <>
      {verified ? (
        <div className="container addBlog-container text-center">
          <div className="adjust">
            <h3>Reset Password</h3>

            {msg ? <div className="alert alert-danger">{msg}</div> : null}
            <form
              method="POST"
              onSubmit={changePassword}
              encType="multipart/form-data"
            >
              <div classname="form-group my-3 row">
                <label for="password" className="col-4 text-end">
                  Password :
                </label>
                <div className="col-8">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="password"
                    aria-describedby="password"
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="cpassword" className="col-4 text-end">
                  Confirm Password :
                </label>
                <div className="col-8">
                  <input
                    type="password"
                    name="cpassword"
                    value={cpassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    className="form-control"
                    id="cpassword"
                    aria-describedby="cpassword"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                name="submit"
                id="submit"
                className="btn btn-outline-primary"
              >
                {reset}
                {reset2}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <h2 className="adjust">Unauthorized Link</h2>
      )}
    </>
  );
}

export default ForgetPassword;
