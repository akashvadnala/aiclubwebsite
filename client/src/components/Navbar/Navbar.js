import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.css';
import {SERVER_URL} from '../../EditableStuff/Config';
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal';
import { Context } from '../../Context/Context';
import axios from 'axios';

const Navbar = () => {
    
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
                'name':'projects'
            },
            {
                'show':false,
                'link':'/blogs',
                'name':'Blogs'
            },
            {
                'show':true,
                'link':'/events',
                'name':'Past Events'
            },
            {
                'show':true,
                'link':'/inductions',
                'name':'Inductions'
            },
            {
                'show':true,
                'link':'/about',
                'name':'About'
            },
            {
                'show':true,
                'link':'#contact-us',
                'name':'Contact Us'
            }
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
                    if(nav.show)
                        return(
                            <li className="nav-item">
                                <NavLink className="nav-link" to={nav.link}>{nav.name}</NavLink>
                            </li>
                        )
                    else
                        return null;
                })
            }
            {
                user?
                <li className="nav-item">
                
                    <div className="dropdown show">
                        <a className="nav-link dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Hello {user.firstname}
                        </a>
                    
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a className="dropdown-item" href="/addproject">Add Project</a>
                            <a className="dropdown-item" href="/myprojects">My Projects</a>
                            {user?user.isadmin?<a className="dropdown-item" href="/admin">Admin</a>:null:null}
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
                <NavLink className="navbar-brand title" to='/'>Navbar</NavLink>
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