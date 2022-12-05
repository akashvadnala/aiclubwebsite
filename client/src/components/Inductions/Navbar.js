import React from "react";
import "./Inductions.css";
import {Link} from "react-router-dom";

const Navbar=()=>{
    return(
        <div >
            <div >
                <h2>Induction Title</h2>
                <h3>Description</h3>
            </div>
            <img src={require('./header.jpeg')} className="img-fluid" alt="default"/>
            <div>
            <ul className="nav nav-pills">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">Active</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/">Link</a>
                </li>
            </ul>
                <div><Link to="/inductions/overview"> Overview </Link></div>
                <div><Link to="/inductions/data"> Data </Link></div>
                <div><Link to="/inductions/leaderboard"> Leaderboard </Link></div>
            </div>
            <div>
                <div><button> Login </button></div>
                <div><button> Register </button></div>
            </div>

        </div>
    );
}

export default Navbar;