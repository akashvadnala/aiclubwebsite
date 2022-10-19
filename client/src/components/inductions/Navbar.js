import React from "react";
import "./induct.css";
import {Link} from "react-router-dom";

const Navbar=()=>{
    return(
        <div >
            <div >
                <h2>Induction Title</h2>
                <h3>Description</h3>
            </div>
            <div >
                <div><Link to="/overview"> Overview </Link></div>
                <div><Link to="/data"> Data </Link></div>
                <div><Link to="/leaderboard"> Leaderboard </Link></div>
            </div>
            <div>
                <div><button> Login </button></div>
                <div><button> Register </button></div>
            </div>

        </div>
    );
}

export default Navbar;