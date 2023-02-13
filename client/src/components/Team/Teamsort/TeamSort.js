import axios from 'axios';
import React, { useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import SortableList from './SortableList';
import { SERVER_URL } from '../../../EditableStuff/Config';

const TeamSort = () => {
    const [teams, setTeams] = useState([]);

    const getTeamIds = async () => {
        axios.get(`${SERVER_URL}/getTeamIds`)
        .then(data=>setTeams(data.data));
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(prevItem => (arrayMoveImmutable(prevItem, oldIndex, newIndex)));
      };

      useEffect(() => {
        getTeamIds();
      }, [])
      
    return (
        <>
            <SortableList items={teams} onSortEnd={onSortEnd} />
        </>
    )
}

export default TeamSort