import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import SortableList from './SortableList';
import { SERVER_URL } from '../../../EditableStuff/Config';
import { alertContext } from '../../../Context/Alert';
import { Helmet } from 'react-helmet';

const TeamSort = ({ setSortMode }) => {
    const { showAlert } = useContext(alertContext);
    const [teams, setTeams] = useState([]);

    const getTeamList = async () => {
        axios.get(`${SERVER_URL}/getTeamList`)
            .then(async data => {
                setTeams(data.data);
            });
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setTeams(prevItem => (arrayMoveImmutable(prevItem, oldIndex, newIndex)));
    };

    const sortTeams = async () => {
        await axios.put(`${SERVER_URL}/sortTeams`, { teams: teams },
            {
                withCredentials:true,
                headers: { "Content-Type": "application/json" },
            });
        setSortMode(false);
        showAlert("Team Sorted Successfully!", "success");
    }

    useEffect(() => {
        getTeamList();
    }, [])

    return (
        <>
            <Helmet>
                <title>Team - AI Club</title>
            </Helmet>
            <div className='team-container'>
                <div className='head-img'>
                    <h1>Team Members</h1>
                </div>
                <div className='container team py-4'>
                    <div className='row align-items-center pb-1'>
                        <div className='col-12 col-md-7 align-items-center h3 pt-3 text-center text-md-start'>
                            Team Members
                        </div>
                        <div className='col-12 col-md-5 text-center text-md-end align-items-center'>
                            <div className='right-panel'>
                                <button rel="noreferrer" className='btn mx-2' onClick={() => setSortMode(false)}>
                                    Cancel
                                </button>
                                <button rel="noreferrer" className='btn btn-success mx-2' onClick={sortTeams}>
                                    Save Changes
                                </button>

                            </div>
                        </div>
                    </div>
                    <SortableList items={teams} onSortEnd={onSortEnd} />
                </div>
            </div>
        </>
    )
}

export default TeamSort;