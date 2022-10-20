import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

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
                'show':true,
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
            },
            {
                'show':true,
                'link':'/login',
                'name':'Login'
            }
        ]
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