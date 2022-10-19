import React from "react";
import Navbar from "./Navbar";
import Overview from "./Overview";
import Data from "./Data";
import Leaderboard from "./Leaderboard";
import "./induct.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


const Induct=()=>{
    return(
        <Router>
            <div>
                <Navbar/>
                {/* <Routes>
                    <Route exact path="/overview"><Overview/></Route>
                    <Route exact path="/data"><Data/></Route>
                    <Route exact path="/leaderboard"><Leaderboard/></Route>
                </Routes> */}
            </div>
        </Router>
    );
}

export default Induct;