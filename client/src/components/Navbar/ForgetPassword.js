import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import { alertContext } from "../../Context/Alert";

function ForgetPassword() {
  const params = new useParams();
  const navigate = useNavigate();
  const id = params.id;
  const token = params.token;
  const { showAlert } = useContext(alertContext);
  const [password, setPassword] = useState();
  const [cpassword, setCPassword] = useState();
  const [verified, setVerified] = useState(false);
  const [reset, setReset] = useState(false);

  const Authenticate = async () => {
    try {
      await axios.get(
        `${SERVER_URL}/reset-password/${id}/${token}`
      );
      setVerified(true);
    } catch (err) {
      console.log(err);
      setVerified(false);
    }
  };

  useEffect(() => {
    Authenticate();
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      showAlert("Confirm Password not matching Password", "danger");
    } else {
      setReset(true);
      try {
        await axios.put(
          `${SERVER_URL}/reset-password/${id}/${token}`,
          { password: password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        navigate("/");
        window.location.reload(true);
      } catch (err) {
        showAlert("Something went wrong! Please try after sometime","danger");
        navigate("/");
        window.location.reload(true);
      }
    }
  };

  return (
    <>
      {verified ? (
        <div className="container addBlog-container text-center">
          <div className="adjust">
            <h3>Reset Password</h3>
            <form
              method="POST"
              onSubmit={changePassword}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row">
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
                className="btn btn-primary"
                disabled={reset}
              >
                {
                  reset ? <>Changing Password <i className="fa fa-spinner fa-spin"></i></> : <>Reset Password</>
                }
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
