import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Leaderboard from "./Leaderboard";
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
  const [page, setPage] = useState(null);
  const [comp, setComp] = useState([]);
  const [load, setLoad] = useState(0);
  const [hostAccess, setHostAccess] = useState(false);
  const getCompete = async () => {
    try {
      axios.get(`${SERVER_URL}/getCompete/${spath}`).then((data) => {
        if (data.status === 200) {
          if (user) {
            if (data.data.access.includes(user._id)) {
              setHostAccess(true);
            }
          }
          setComp(data.data);
          setLoad(1);
        } else {
          console.log("Competition not found");
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log("Connot get Compete data");
      setLoad(-1);
    }
  };

  let parameters = {
    path: path,
    c: comp,
    access: hostAccess,
    username: user ? user.username : null,
  };

  const getPage = async () => {
    
    switch (path) {
      case undefined:
        setPage(<Overview props={parameters} />);
        break;
      case "overview":
        setPage(<Overview props={parameters} />);
        break;
      case "host":
        setPage(<Host props={parameters} />);
        break;
      case "leaderboard":
        setPage(<Leaderboard props={parameters} />);
        break;
      case "submissions":
        setPage(<Submissions props={parameters} />);
        break;
      case "register":
        setPage(<Register c={comp} />);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
      getCompete();
  }, [logged_in, spath, path]);

  useEffect(()=>{
    getPage();
  },[comp]);
  
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        page ? (
          <div className="compete-container py-3">
          <Helmet>
            <title>
              {comp.title}
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
