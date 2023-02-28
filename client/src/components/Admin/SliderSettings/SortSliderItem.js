import React from 'react'
import { NavLink } from 'react-router-dom';
import { SortableElement } from 'react-sortable-hoc';


const SortSliderItem = (props) => {
    const { slide, params, sortIndex } = props;
    const { setSlider, setXSlider, setPhoto, setAddOrEdit, deleteSlider } = params;
    return (
        <li className="d-flex">{`#${sortIndex}-`}
            <div className='slider-card card p-3 mb-3 w-100' style={{ overflow: "hidden" }}>
                <div className='card slider-card-in flex-row actual-card' onClick={() => setSlider(slide)}>
                    <img className="card-img-left" src={slide.photo} alt={slide.title} style={{ width: "150px", height: "100px" }} />
                    <div className="small px-3">
                        <div>Title:<strong> {slide.title}</strong></div>
                        <div>Caption1: <strong> {slide.caption1}</strong></div>
                        <div>Caption2:<strong> {slide.caption2}</strong></div>
                        <div>Link:<strong> {slide.link}</strong></div>
                        <div>Link Hypertext:<strong> {slide.linkhypertext}</strong></div>
                        <div>textcolor:<strong> {slide.textcolor}</strong></div>
                    </div>
                </div>

                <div className='edit-delete text-center pt-2'>
                    <NavLink type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#sliderModal"
                        onClick={() => {
                            setXSlider(slide);
                            setPhoto(slide.photo);
                            setAddOrEdit(1);
                        }}
                    >
                        Edit
                    </NavLink>
                    &nbsp;
                    <NavLink type="button" className="btn btn-sm btn-danger" onClick={() => deleteSlider(slide._id, slide.photo, slide.title)}>
                        Delete
                    </NavLink>
                </div>
            </div>
        </li>
    )
}

export default SortableElement(SortSliderItem)