import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.css';
import {SERVER_URL} from '../../EditableStuff/Config';
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal';
import { Context } from '../../Context/Context';
import axios from 'axios';
// import CList from '../../EditableStuff/CList';

const Navbar = () => {

    const [compete,setCompete] = useState([]);

    const getCompeteNames = async () => {
        try{
            axios.get(`${SERVER_URL}/getCompeteNames`)
            .then(data => {
                console.log('competenames',data.data);
                setCompete(data.data);
            })
        }catch(err){
            console.log('Cannot get Compete Names');
        }
    }

    useEffect(() => {
        getCompeteNames();
    },[]);
    
    const RenderMenu = () =>{
        const navs = [
            {
                'show':true,
                'link':'/team',
                'name':'Team'
            },
            {
                'show':true,
                'link':'/projects',
                'name':'Projects'
            },
            {
                'show':true,
                'link':'/blogs',
                'name':'Blogs'
            },
            {
                'show':true,
                'link':'/events',
                'name':'Past Events'
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
        ]
        const { user } = useContext(Context);
        console.log('user',user);
        const [modalShow, setModalShow] = React.useState(false);
        const Logout = async () => {
            try{
                const res = await axios.get(`${SERVER_URL}/logout`,
                    {withCredentials:true}
                );
                console.log(res.msg);
            }catch(err){
                console.log('Unable to logout..')
            }
            window.location.reload(true);
        }
        return(
        <>
            <li>
                <NavLink className="navbar-brand" to='/'>AI CLUB</NavLink>
            </li>
            {
                navs.map((nav)=>{
                    if(nav.show){
                        return(
                            <li className="nav-item" key={nav.link}>
                                <NavLink className="nav-link" to={nav.link}>{nav.name}</NavLink>
                            </li>
                        )
                    }
                    else{
                        return null;
                    }
                })
            }
                <li className="nav-item">
                    
                    <div className="dropdown show">
                        <NavLink className="nav-link dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Competitions
                        </NavLink>
                    
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            {
                                compete.map((c) => {
                                    return(

                                        <NavLink key={c.title} className="dropdown-item" to={`/competitions/${c.url}`}>{c.title}</NavLink>

                                    )
                                })
                            }
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/about">About</NavLink>
                </li>
                {/* <li className="nav-item">
                    <NavLink className="nav-link" to="#contact-us">Contact Us</NavLink>
                </li> */}
            {
                user?
                <li className="nav-item">
                
                    <div className="dropdown show">
                        <NavLink className="nav-link dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Hello {user.firstname}
                        </NavLink>
                    
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            {user?(user.canCreateCompetitions || user.isadmin)?<NavLink className="dropdown-item" to="/create-competition">Create Competition</NavLink>:null:null}
                            <NavLink className="dropdown-item" to="/addproject">Add Project</NavLink>
                            <NavLink className="dropdown-item" to="/myprojects">My Projects</NavLink>
                            {user?user.isadmin?<NavLink className="dropdown-item" to="/admin">Admin</NavLink>:null:null}
                            <a className="dropdown-item" href="#" onClick={Logout}>Logout</a>
                        </div>
                    </div>
                </li>
                :
                <li className="nav-item">
                    <NavLink className="nav-link" variant="primary" onClick={() => setModalShow(true)}>
                        Login
                    </NavLink>
                </li>
            }
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
        )
    }

  return (
        <nav variant="primary" className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <NavLink className="navbar-brand title" to='/'>AI CLUB</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="adjust navbar-nav">
                        <RenderMenu />
                    </ul>
                </div>
            </div>
        </nav>
  )
}

export default Navbar