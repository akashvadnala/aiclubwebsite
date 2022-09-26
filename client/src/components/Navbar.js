import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {

    const RenderMenu = () =>{
        return(
        <>
            <li>
                <NavLink className="navbar-brand" to='/'>Navbar</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/team">Our Team</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/projects">Projects</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/blogs">Blogs</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/events">Past Events</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/inductions">Inductions</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
        </>
        )
    }

  return (
    <>
        <nav variant="primary" className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <NavLink className="navbar-brand title" to='/'>Navbar</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <RenderMenu />
                    </ul>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar