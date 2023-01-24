import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import { SERVER_URL } from "../../EditableStuff/Config";
import TeamLogin from "./TeamLogin";
import { Context } from "../../Context/Context";
import axios from "axios";
import CompeteLogin from "./CompeteLogin";
// import CList from '../../EditableStuff/CList';
import Logo from '../../EditableStuff/ai-logo.jpg';

const Navbar = () => {
  const [compete, setCompete] = useState([]);

  const getCompeteNames = async () => {
    try {
      axios.get(`${SERVER_URL}/getCompeteNames`).then((data) => {
        console.log("competenames", data.data);
        setCompete(data.data);
      });
    } catch (err) {
      console.log("Cannot get Compete Names");
    }
  };

  useEffect(() => {
    getCompeteNames();
  }, []);

  const RenderMenu = () => {
    const navs = [
      {
        show: true,
        link: "/team",
        name: "Team",
      },
      {
        show: true,
        link: "/projects",
        name: "Projects",
      },
      {
        show: true,
        link: "/blogs",
        name: "Blogs",
      },
      {
        show: true,
        link: "/events",
        name: "Events",
      },
      // {
      //     'show':true,
      //     'link':'/inductions-b21-b20',
      //     'name':'Inductions'
      // },
      // {
      //     'show':true,
      //     'link':'/about',
      //     'name':'About'
      // },
      // {
      //     'show':true,
      //     'link':'#contact-us',
      //     'name':'Contact Us'
      // }
    ];
    // const { user } = useContext(Context);
    // console.log('user',user);
    // const { cuser } = useContext(CompeteContext);
    const [user, setUser] = useState(null);
    const getUser = () => {
      try {
        axios
          .get(`${SERVER_URL}/getUserData`, { withCredentials: true })
          .then((data) => {
            if (data.status === 200) {
              setUser(data.data);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    useEffect(() => {
      getUser();
    }, []);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalShow2, setModalShow2] = React.useState(false);
    const Logout = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/logout`, {
          withCredentials: true,
        });
        console.log(res.msg);
      } catch (err) {
        console.log("Unable to logout..");
      }
      window.location.reload(true);
    };

    const location = useLocation();
    return (
      <>
        <li>
          <NavLink className="navbar-brand" to='/'><span><img src={Logo} arc="Logo" style={{width:"30px", borderRadius:"5px"}} /></span><span>&nbsp;Club</span></NavLink>
        </li>
        {navs.map((nav) => {
          if (nav.show) {
            return (
              <li className="nav-item" key={nav.link}>
                <NavLink className="nav-link" to={nav.link}>
                  {nav.name}
                </NavLink>
              </li>
            );
          } else {
            return null;
          }
        })}
        {/* <li className="nav-item">
          <div className="dropdown show">
            <NavLink
              className="nav-link dropdown-toggle"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Competitions
            </NavLink>

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              {compete.map((c) => {
                return (
                  <NavLink
                    key={c.title}
                    className="dropdown-item"
                    to={`/competitions/${c.url}`}
                  >
                    {c.title}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </li> */}
        <li className="nav-item">
          <NavLink className="nav-link" to="/about">
            About
          </NavLink>
        </li>
        {/* <li className="nav-item">
                    <NavLink className="nav-link" to="#contact-us">Contact Us</NavLink>
                </li> */}
        {user ? (
          <li className="nav-item">
            <div className="dropdown show">
              <NavLink
                className="nav-link dropdown-toggle"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Hello {user.firstname}
              </NavLink>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                {/* {user ? (
                  user.canCreateCompetitions || user.isadmin ? (
                    <>
                      <NavLink
                        className="dropdown-item"
                        to="/create-competition"
                      >
                        Create Competition
                      </NavLink>
                      <hr />
                    </>
                  ) : null
                ) : null} */}
                <NavLink className="dropdown-item" to="/profile">
                  My Profile
                </NavLink>
                <hr />
                {user ? (
                  user.isadmin ? (
                    <>
                      <NavLink className="dropdown-item" to="/admin">
                        Admin
                      </NavLink>
                      <hr />
                    </>
                  ) : null
                ) : null}
                <a className="dropdown-item" href="#" onClick={Logout}>
                  Logout
                </a>
              </div>
            </div>
          </li>
        ) : (
          <li className="nav-item">
            <div className="dropdown show">
              <NavLink
                className="nav-link dropdown-toggle"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Login
              </NavLink>

              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <div
                  className="dropdown-item pe-cursor"
                  onClick={() => {
                    setModalShow2(false);
                    setModalShow(true);
                  }}
                >
                  Team Member
                </div>
                <hr />
                <div
                  className="dropdown-item pe-cursor"
                  onClick={() => {
                    localStorage.setItem(
                      "aiclubnitcsignupredirect",
                      location.pathname
                    );
                    setModalShow(false);
                    setModalShow2(true);
                  }}
                >
                  Competition
                </div>
              </div>
            </div>
            {/* <NavLink className="nav-link" variant="primary" onClick={() => setModalShow(true)}>
                        Login
                    </NavLink> */}
          </li>
        )}
        <TeamLogin show={modalShow} onHide={() => setModalShow(false)} />
        <CompeteLogin
          compete={null}
          show={modalShow2}
          onHide={() => setModalShow2(false)}
        />
      </>
    );
  };

  return (
    <nav variant="primary" className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <NavLink className="navbar-brand title" to='/'><span><img src={Logo} arc="Logo" style={{width:"30px", borderRadius:"5px"}} /></span><span>&nbsp;Club</span></NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="adjust navbar-nav">
            <RenderMenu />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
