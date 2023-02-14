import React from 'react'
import { SortableContainer } from 'react-sortable-hoc';
import SortSliderItem from './SortSliderItem';

const SortSliderList = (props) => {
    const {slides,params} = props;
    return (
        <ul>
            {
                slides.map((slide,index) => {
                    return (
                        <SortSliderItem key={`item-${index}`} index={index} slide={slide} params={params} sortIndex={index} />
                    )
                })}
        </ul>
    )
}

export default SortableContainer(SortSliderList);