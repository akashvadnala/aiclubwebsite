import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { SERVER_URL } from '../../EditableStuff/Config';
import './Admin.css'

const Admin = () => {
    // const slides = [
    //     {
    //         'imgsrc': 'https://i2.wp.com/myblogs.pw/wp-content/uploads/2018/08/AI-Web.jpg?fit=1034%2C480&ssl=1',
    //         'title': 'Inductions For B20 and B21',
    //         'caption1': 'AI CLUB Inductions for batch B20 and B21.',
    //         'caption2': 'NITC',
    //         'linktitle': 'Inductions',
    //         'link': '/competitions/ai-club-inductions',
    //         'textcolor': 'white'
    //     },
    //     {
    //         'imgsrc': 'https://media.istockphoto.com/photos/artificial-intelligence-concept-picture-id1364859722?b=1&k=20&m=1364859722&s=170667a&w=0&h=o7emaeAZHOvBP1_o5ewQH9y9279rQWS9xO_xU4r-u-4=',
    //         'title': 'Inductions For B20 and B21',
    //         'caption1': 'AI CLUB Inductions for batch B20 and B21.',
    //         'caption2': 'AI CLUB Inductions for batch B20 and B21.',
    //         'linktitle': 'Inductions',
    //         'link': '/competitions/ai-club-inductions',
    //         'textcolor': 'safcd'
    //     },
    //     {
    //         'imgsrc': 'https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png',
    //         'title': 'Inductions For B20 and B21',
    //         'caption1': 'AI CLUB Inductions for batch B20 and B21.',
    //         'linktitle': 'Inductions',
    //         'link': '/competitions/ai-club-inductions',
    //         'textcolor': '#99ff00'
    //     }
    // ]
    const [slides,setSlides] = useState([]);
    const [ slider, setSlider ] = useState(null);
    const [ xSlider, setXSlider ] = useState({
        photo:"",
        title:"",
        caption1:"",
        caption2:"",
        link:"",
        textcolor:""
    });

    const handlePhoto = (e) => {
        console.log('photo',e.target.files[0]);
        setXSlider({ ...xSlider, ["photo"]: e.target.files[0] });
    };

    const handleInput = (e) => {
        setXSlider({...xSlider,[e.target.name]: e.target.value});
    }
    const [add,setAdd] = useState(0);

    const getSlides = async () => {
        try{
            axios.get(`${SERVER_URL}/getSlides`)
            .then(data=>{
                if(data.status===200){
                    setSlides(data.data);
                    setSlider(data.data[0]);
                }
            })
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getSlides();
    },[]);

    const addSlider = async (e) => {
        e.preventDefault();
        setAdd(1);
        const photo = xSlider.photo;
        const data = new FormData();
        const photoname = Date.now() + photo.name;
        data.append("name",photoname);
        data.append("photo",photo);
        var imgurl;

        try{
            const img = await axios.post(`${SERVER_URL}/imgupload`,data);
            console.log('img',img);
            imgurl = img.data;
            xSlider.photo=imgurl;
        }catch(err){
            console.log('photoerr',err);
        }
        console.log('imgurl',imgurl);

        try{
            const data = await axios.post(`${SERVER_URL}/addSlider`,
                xSlider,
                {
                    headers:{"Content-Type" : "application/json"}
                }
            );
            if(data.status===200){
                getSlides();
                document.getElementById("modalClose"). click();
                console.log(`${xSlider.title} is Added`);
                setAdd(0);
                setXSlider({...xSlider,
                    photo:"",
                    title:"",
                    caption1:"",
                    caption2:"",
                    link:"",
                    textcolor:""
                });
            }
            else{
                setAdd(0);
            }
        }catch(err){
            console.log('err',err);
        }
    }

    return (
        <>
            <div className='admin-container'>
                <div className='adjust'>
                    <h2 className='text-center'>Admin Panel</h2>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6'><h4 className='pb-2'>Slider Settings</h4></div>
                        <div className='col-6 text-end'>
                            <NavLink type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-plus-circle-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg>{" "}
                                Add Slider
                            </NavLink>
                            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Slider</h1>
                                        </div>
                                            
                                        <form method="POST" onSubmit={addSlider} encType="multipart/form-data">
                                            <div className="text-start modal-body">
                                                <div className="form-group my-3">
                                                    <input type="file" accept="image/*" name="photo" onChange={handlePhoto} className="form-control form-control-lg" id="photo" aria-describedby="photo" placeholder='Slider Image' required />
                                                </div>
                                                <div className="form-group my-3">
                                                    <input type="text" name="title" value={xSlider.title} onChange={handleInput} className="form-control form-control-lg" id="title" aria-describedby="title" placeholder="Title" required />
                                                </div>
                                                <div className="form-group my-3">
                                                    <input type="text" name="caption1" value={xSlider.caption1} onChange={handleInput} className="form-control form-control-lg" id="caption1" aria-describedby="caption1" placeholder="Caption 1" required />
                                                </div>
                                                <div className="form-group my-3">
                                                    <input type="text" name="caption2" value={xSlider.caption2} onChange={handleInput} className="form-control form-control-lg" id="caption2" aria-describedby="caption2" placeholder="Caption 2 " required />
                                                </div>
                                                <div className="form-group my-3">
                                                    <input type="text" name="link" value={xSlider.link} onChange={handleInput} className="form-control form-control-lg" id="link" aria-describedby="link" placeholder="Link" required />
                                                </div>
                                                <div className="form-group my-3">
                                                    <input type="text" name="textcolor" value={xSlider.textcolor} onChange={handleInput} className="form-control form-control-lg" id="textcolor" aria-describedby="textcolor" placeholder="Text Color" required />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="reset" id="modalClose" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-sm btn-primary">
                                                    {
                                                        add?<span>Adding <i class="fa fa-spinner fa-spin"></i></span>:<span>Add</span>
                                                    }
                                                </button>
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
                                    <div class="slider-card card flex-row p-2 mb-3" style={{ cursor: "pointer" }} onClick={() => setSlider(slide)}>
                                        <img className="card-img-left" src={slide.photo} alt={slide.title} style={{ width: "200px", height: "100px" }} />
                                        <div class="card-body p-0 small px-2">
                                            <div>Title:<strong> {slide.title}</strong></div>
                                            <div>Caption1: <strong> {slide.caption1}</strong></div>
                                            <div>Caption2:<strong> {slide.caption2}</strong></div>
                                            <div>Link:<strong> {slide.link}</strong></div>
                                            <div>textcolor:<strong> {slide.textcolor}</strong></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='col-7'>
                            {
                            slider &&
                                <>
                                    <img src={slider.photo} alt={slider.title} style={{ width: "100%", height: "55vh" }} />
                                    <div className='caption-edit text-center' style={{ color: `${slider.textcolor}`, position: "relative", top: "-48vh" }}>
                                        <h2>{slider.title}</h2>
                                        <p>{slider.caption1}</p>
                                        <h6>{slider.caption2}</h6>
                                        <p><NavLink className="mt-3 btn align-items-center" style={{ color: `${slider.textcolor}` }} to={slider.link}>Learn More <span>❯</span></NavLink></p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Admin