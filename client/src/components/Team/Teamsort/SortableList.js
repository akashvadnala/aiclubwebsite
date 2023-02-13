import React from 'react';
import SortableItem from './SortableItem';
import { SortableContainer } from 'react-sortable-hoc';
 
const SortableList = (props) => {
  return (
    <ul>
      {props.items.map((team, index) => (
        <SortableItem key={`item-${index}`} index={index} value={`${team.firstname} ${team.lastname} (${team.position})`} sortIndex={index} />
      ))}
    </ul>
  );
}
 
export default SortableContainer(SortableList);