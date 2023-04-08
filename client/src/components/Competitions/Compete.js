import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import MySubmissions from "./MySubmissions";
import Overview from "./Overview";
import Register from "./Register";
import Error from "../Error";
import Loading from "../Loading";
import InductionsHeader from "./InductionsHeader";
import Submissions from "./Submissions";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import Host from "./Host";
import { Context } from "../../Context/Context";
import { Helmet } from "react-helmet";

const Compete = () => {
  const params = new useParams();
  var path = params.path;
  const spath = params.spath;
  if (path === undefined) {
    path = "overview";
  }
  const { user, logged_in } = useContext(Context);
  const [page, setPage] = useState(<Error />);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState(0);

  const [parameters, setParameters] = useState({
    path: path,
    c: null,
    access: false,
    username: null,
  });

  const getCompete = async () => {
    axios.get(`${SERVER_URL}/getCompete/${spath}`).then((data) => {
      let access = false;
      let username = null;
      if (user) {
        username = user.username
        if (data.data.access.includes(user._id)) {
          access = true;
        }
      }
      setParameters({ ...parameters, path: path, access: access, c: data.data, username: username });
      setTitle(data.data.title);
    }).catch(err => {
      setLoad(-1);
    });
  };

  const getPage = async () => {

    switch (path) {
      case undefined:
        setPage(<Overview props={parameters} />);
        setLoad(1);
        break;
      case "overview":
        setPage(<Overview props={parameters} />);
        setLoad(1);
        break;
      case "host":
        setPage(<Host props={parameters} />);
        setLoad(1);
        break;
      case "leaderboard":
        setPage(<Leaderboard props={parameters} />);
        setLoad(1);
        break;
      case "mysubmissions":
        setPage(<MySubmissions props={parameters} />);
        setLoad(1);
        break;
      default:
        setPage(<Error />)
        setLoad(1);
        break;
    }
  };

  useEffect(() => {
    if (spath && path) {
      getCompete();
    }
  }, [logged_in, spath, path]);

  useEffect(() => {
    if (parameters.c) {
      getPage();
    }
  }, [parameters]);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        page ? (
          <div className="compete-container py-3">
            <Helmet>
              <title>
                {title}
              </title>
            </Helmet>
            <div className="adjust">
              <InductionsHeader props={parameters} />
              {page}
            </div>
          </div>
        ) : (
          <Error />
        )
      ) : (
        <Error />
      )}
    </>
  );
};

export default Compete;
