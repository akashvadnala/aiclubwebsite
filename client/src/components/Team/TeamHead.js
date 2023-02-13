import React, { useState } from 'react'
import Team from './Team';
import TeamSort from './Teamsort/TeamSort';

const TeamHead = () => {
    const [sortMode, setSortMode] = useState(false);
    return (
        <>
            {
                sortMode?
                <>
                    <TeamSort setSortMode={setSortMode} />
                </>
                :
                <>
                    <Team setSortMode={setSortMode} />
                </>
            }
        </>
    )
}

export default TeamHead