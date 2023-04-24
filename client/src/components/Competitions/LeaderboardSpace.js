import React, { useEffect, useState } from 'react'

const LeaderboardSpace = ({ l, index, privateLB }) => {
    const [updatedAt, setUpdatedAt] = useState("0 sec ago");
    var s = {
        day: 86400, // feel free to add your own row
        hour: 3600,
        min: 60,
        sec: 1,
    };
    useEffect(() => {
        if (l) {
            var r = {};
            let present = new Date();
            let start = new Date(l.updatedAt);
            var d = Math.abs(start - present) / 1000;
            Object.keys(s).every((key) => {
                r[key] = Math.floor(d / s[key]);
                d -= r[key] * s[key];
                if (r[key] !== 0) {
                    // if (r[key] === 1) {
                    //     setUpdatedAt(`${r[key]} ${key.slice(0, -1)} ago`);
                    // } else {
                    setUpdatedAt(`${r[key]} ${key} ago`);
                    // }
                    return false;
                }
                return true;
            })
        }
    }, [l]);
    return (
        <>
            <tr>
                <th scope="row">{index + 1}</th>
                {/* <th>{names[index]}</th> */}
                <th>{l.team}</th>
                {privateLB && <th style={{ verticalAlign: "middle" }}>
                    {l.difference > 0 ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#00ff00" width="10px" height="10px" viewBox="0 0 24 24" stroke="#00ff00">
                            <g id="SVGRepo_bgCarrier" stroke-width="0" />
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z" />
                            </g>
                        </svg>
                        &nbsp;{l.difference}
                    </>
                        :
                        l.difference < 0 ? <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ff0000" width="10px" height="10px" viewBox="0 0 24 24" stroke="#ff0000" transform="rotate(180)">
                                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z" />
                                </g>
                            </svg>
                            &nbsp;{l.difference * -1}
                        </>
                            :
                            <>--</>}
                </th>}
                <th>{l.score['$numberDecimal'].toLocaleString()}</th>
                <th>{l.numSubmissions}</th>
                <th>{updatedAt}</th>
            </tr>
        </>
    )
}

export default LeaderboardSpace