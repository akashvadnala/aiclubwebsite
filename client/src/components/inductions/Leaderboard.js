import React from "react";
import InductionsHeader from "./InductionsHeader";


const Leaderboard = (props) => {
    const title = props.title;
    return(
        <>
            {
                <div className="leaderboard-container">
                    This is {title} Leaderboard Tab
                </div>
            }
        </>
    );
}

export default Leaderboard;