import React from 'react'
import { NavLink } from "react-router-dom";

const HostHeader = ({ props, hpath }) => {
    const keys = {
        settings: "Settings",
        evaluation: "Evaluation",
        sandboxsubmissions: "SandBoxSubbmission",
        allsubmissions: "AllSubbmission",
    };
    return (
        <>
            <div className="px-3 py-2">
                <div className="row">
                    <nav className="inductions-navbar">
                        <div className="nav nav-pills row" id="nav-tab" role="tablist">
                            {Object.entries(keys).map(([key, value]) => {
                                return (
                                    <NavLink
                                        type="button"
                                        role="tab"
                                        className={`nav-link ${hpath === key && key === 'settings' && "active"}`}
                                        to={`/competitions/${props.c.url}/host/${key}`}
                                        aria-current="page"
                                        key={key}
                                    >
                                        {value}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default HostHeader
