import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Context } from '../../../Context/Context';
import { SERVER_URL } from '../../../EditableStuff/Config';
import Error from '../../Error';
import Loading from '../../Loading';
import '.././Admin.css'
import { Helmet } from 'react-helmet';
import { alertContext } from '../../../Context/Alert';

const Admin = () => {
    const { user, logged_in } = useContext(Context);
    const { showAlert } = useContext(alertContext);
    const [load, setLoad] = useState(0);
    const [slides, setSlides] = useState([]);
    const [slider, setSlider] = useState(null);
    const [xSlider, setXSlider] = useState({
        photo: "",
        title: "",
        caption1: "",
        caption2: "",
        link: "",
        textcolor: "white",
        index: 0
    });
    const [photo, setPhoto] = useState("");
    const [photoUpdated, setPhotoUpdated] = useState(0);
    const handlePhoto = (e) => {
        console.log('photo', e.target.files[0]);
        setXSlider({ ...xSlider, [e.target.name]: e.target.files[0] });
        setPhoto(URL.createObjectURL(e.target.files[0]));
        setPhotoUpdated(1);
    };

    const handleInput = (e) => {
        setXSlider({ ...xSlider, [e.target.name]: e.target.value });
    }
    const [add, setAdd] = useState(0);
    const [edit, setEdit] = useState(0);
    const [addOrEdit, setAddOrEdit] = useState(0) //0->add,1->edit
    const getSlides = async () => {
        try {
            axios.get(`${SERVER_URL}/getSlides`)
                .then(data => {
                    setSlides(data.data);
                    setSlider(data.data[0]);
                    setLoad(1);
                })
        } catch (err) {
            showAlert(err.response.data.error, "danger");
        }
    }

    useEffect(() => {
        if (logged_in === 1) {
            getSlides();
        }
        else if (logged_in === -1) {
            setLoad(-1);
        }
    }, [logged_in]);

    const addSlider = async (e) => {
        e.preventDefault();
        try {
            setAdd(1);
            const data = new FormData();
            data.append("photo", xSlider.photo);
            const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
            xSlider.photo = img.data;

            await axios.post(`${SERVER_URL}/addSlider`,
                xSlider,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );
            getSlides();
            document.getElementById("modalClose").click();
            console.log(`${xSlider.title} is Added`);
            setAdd(0);
            setXSlider({
                ...xSlider,
                photo: "",
                title: "",
                caption1: "",
                caption2: "",
                link: "",
                textcolor: "white",
                index: 0
            });
        } catch (err) {
            showAlert(err.response.data.error);
        }

        setAdd(0);
    }

    const updateSlider = async (e) => {
        e.preventDefault();
        setEdit(1);
        if (photoUpdated) {
            await axios.post(`${SERVER_URL}/imgdelete`,
                {
                    'url': xSlider.photo
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                });
            const photo = xSlider.photo;
            const data = new FormData();
            data.append("photo", photo);

            try {
                const img = await axios.post(`${SERVER_URL}/imgupload`, data, { withCredentials: true });
                console.log('img', img);
                xSlider.photo = img.data;
            } catch (err) {
                console.log('photoerr', err);
            }
        }
        try {
            const data = await axios.put(`${SERVER_URL}/updateSlider/${xSlider._id}`,
                xSlider,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            if (data.status === 200) {
                getSlides();
                document.getElementById("modalClose").click();
                console.log(`${xSlider.title} is Edited`);
                setEdit(0);
                setXSlider({
                    ...xSlider,
                    photo: "",
                    title: "",
                    caption1: "",
                    caption2: "",
                    link: "",
                    textcolor: "white",
                    index: 0
                });
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    const deleteSlider = async (id, photo, title) => {
        const confirmed = window.confirm(`Are you sure to delete the slider '${title}'?`);
        if (confirmed) {
            try {
                await axios.post(`${SERVER_URL}/imgdelete`,
                    {
                        'url': photo
                    },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    });
                await axios.delete(`${SERVER_URL}/deleteSlider/${id}`, { withCredentials: true })
                getSlides();
            } catch (err) {
                console.log(err);
            }
        }
    }

    const sliderMoveDown = (index) => {
        if (index > 1) {
            try {
                axios.post(`${SERVER_URL}/sliderMoveDown`,
                    {
                        'index': index
                    })
                    .then(res => {
                        if (res.status === 200) {
                            getSlides();
                        }
                    })
            } catch (err) {
                console.log(err);
            }
        }
    }

    const sliderMoveUp = (index) => {
        if (index < slides.length) {
            try {
                axios.post(`${SERVER_URL}/sliderMoveUp`,
                    {
                        'index': index
                    })
                    .then(res => {
                        if (res.status === 200) {
                            getSlides();
                        }
                    })
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className='admin-container'>
                    <Helmet>
                        <title>Admin - AI Club</title>
                    </Helmet>
                    <div className='adjust'>
                        <h2 className='text-center'>Admin Panel</h2>
                    </div>
                    <div className='px-5'>
                        <div className='row'>
                            <div className='col-6'><h4 className='pb-2'>Slider Settings</h4></div>
                            <div className='col-6 text-end'>
                                <button className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#sliderModal"
                                    onClick={() => {
                                        setAddOrEdit(0);
                                        setXSlider({
                                            ...xSlider,
                                            photo: "",
                                            title: "",
                                            caption1: "",
                                            caption2: "",
                                            link: "",
                                            textcolor: "white",
                                            index: 0
                                        });
                                        setPhoto("");
                                    }}
                                // onClick={AddSlider}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        className="bi bi-plus-circle-fill"
                                        viewBox="0 0 16 18"
                                    >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                    </svg>{" "}
                                    Add Slider
                                </button>
                                <div className="modal fade" id="sliderModal" tabindex="-1" aria-labelledby="sliderModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="sliderModalLabel">Add Slider</h1>
                                            </div>

                                            <form method="POST" encType="multipart/form-data">
                                                <div className="text-start modal-body">
                                                    <div className="form-group my-3">
                                                        {
                                                            xSlider.photo ?
                                                                <>
                                                                    <input type="file" accept="image/*" name="photo" onChange={handlePhoto} className="form-control form-control-lg" id="photo" aria-describedby="photo" />
                                                                </>
                                                                :
                                                                <>
                                                                    <input type="file" accept="image/*" name="photo" onChange={handlePhoto} className="form-control form-control-lg" id="photo" aria-describedby="photo" required />
                                                                </>
                                                        }
                                                    </div>
                                                    <div className="form-group my-3">
                                                        {
                                                            photo && <img src={photo} alt={xSlider.title} style={{ width: "100%", objectFit: "cover" }} />
                                                        }
                                                    </div>
                                                    <div className="form-group my-3">
                                                        <input type="text" name="title" value={xSlider.title} onChange={handleInput} className="form-control form-control-lg" id="title" aria-describedby="title" placeholder="Title" />
                                                    </div>
                                                    <div className="form-group my-3">
                                                        <input type="text" name="caption1" value={xSlider.caption1} onChange={handleInput} className="form-control form-control-lg" id="caption1" aria-describedby="caption1" placeholder="Caption 1" />
                                                    </div>
                                                    <div className="form-group my-3">
                                                        <input type="text" name="caption2" value={xSlider.caption2} onChange={handleInput} className="form-control form-control-lg" id="caption2" aria-describedby="caption2" placeholder="Caption 2 " />
                                                    </div>
                                                    <div className="form-group my-3">
                                                        <input type="text" name="link" value={xSlider.link} onChange={handleInput} className="form-control form-control-lg" id="link" aria-describedby="link" placeholder="Link" />
                                                    </div>
                                                    <div className="form-group my-3">
                                                        <input type="text" name="textcolor" value={xSlider.textcolor} onChange={handleInput} className="form-control form-control-lg" id="textcolor" aria-describedby="textcolor" placeholder="Text Color" />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="reset" id="modalClose" className="btn btn-sm btn-secondary" data-bs-dismiss="modal"
                                                        onClick={() => {
                                                            setXSlider({
                                                                photo: "",
                                                                title: "",
                                                                caption1: "",
                                                                caption2: "",
                                                                link: "",
                                                                textcolor: "white",
                                                                index: 0
                                                            });
                                                            setPhoto("");
                                                        }}
                                                    >Cancel</button>
                                                    {
                                                        addOrEdit ?
                                                            <button type="submit" onClick={updateSlider} className={`btn btn-sm btn-primary`} disabled={edit ? true : false}>
                                                                {
                                                                    edit ? <span>Updating <i className="fa fa-spinner fa-spin"></i></span> : <span>Update</span>
                                                                }
                                                            </button>
                                                            :
                                                            <button type="submit" onClick={addSlider} className={`btn btn-sm btn-primary`} disabled={add ? true : false}>
                                                                {
                                                                    add ? <span>Adding <i className="fa fa-spinner fa-spin"></i></span> : <span>Add</span>
                                                                }
                                                            </button>
                                                    }
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-5'>
                                {slides.map((slide) => {
                                    return (
                                        <>
                                            <div className='slider-card card p-3 mb-3' style={{ overflow: "hidden" }}>
                                                <div className='card slider-card-in flex-row actual-card' onClick={() => setSlider(slide)}>
                                                    <img className="card-img-left" src={slide.photo} alt={slide.title} />
                                                    <div className="small px-3">
                                                        <div>Title:<strong> {slide.title}</strong></div>
                                                        <div>Caption1: <strong> {slide.caption1}</strong></div>
                                                        <div>Caption2:<strong> {slide.caption2}</strong></div>
                                                        <div>Link:<strong> {slide.link}</strong></div>
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
                                        </>
                                    )
                                })}
                            </div>
                            <div className='col-7'>
                                {
                                    slider &&
                                    <>
                                        <h3 className='text-center'>Preview</h3>
                                        <img src={slider.photo} alt={slider.title} style={{ width: "100%", height: "28vw" }} />
                                        <div className='caption-edit text-center' style={{ color: `${slider.textcolor}`, position: "relative", top: "-48vh" }}>
                                            <h2>{slider.title}</h2>
                                            <p>{slider.caption1}</p>
                                            <h6>{slider.caption2}</h6>
                                            {slider.link && <p><a className="mt-3 btn align-items-center" style={{ color: `${slider.textcolor}` }} href={slider.link}>Learn More <span>❯</span></a></p>}
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                </div>
                : <Error />}
        </>
    )
}

export default Admin