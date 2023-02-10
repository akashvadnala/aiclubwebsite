import axios from 'axios';
import React, { useState } from 'react'
import { SERVER_URL } from '../../EditableStuff/Config';

const AddSlider = () => {
    const [ xSlider, setXSlider ] = useState({
        photo:"",
        title:"",
        caption1:"",
        caption2:"",
        link:"",
        textcolor:"",
        index:""
    });
    const [photo,setPhoto] = useState("");
    const handlePhoto = (e) => {
        console.log('photo',e.target.files[0]);
        setXSlider({ ...xSlider, ["photo"]: e.target.files[0] });
        setPhoto(URL.createObjectURL(e.target.files[0]));
    };

    const handleInput = (e) => {
        setXSlider({...xSlider,[e.target.name]: e.target.value});
    }
    const [add,setAdd] = useState(0);
    const addSlider = async (e) => {
        e.preventDefault();
        // console.log('adding');
        setAdd(1);
        const photo = xSlider.photo;
        const data = new FormData();
        const photoname = Date.now() + photo.name;
        data.append("name",photoname);
        data.append("photo",photo);
        var imgurl;
        // console.log('photoname',photoname);
        try{
            const img = await axios.post(`${SERVER_URL}/imgupload`,data);
            // console.log('img',img);
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
                // getSlides();
                document.getElementById("modalClose"). click();
                console.log(`${xSlider.title} is Added`);
                setAdd(0);
                setXSlider({...xSlider,
                    photo:"",
                    title:"",
                    caption1:"",
                    caption2:"",
                    link:"",
                    textcolor:"",
                    index:""
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
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="sliderModalLabel">Add Slider</h1>
            </div>

            <form method="POST" onSubmit={addSlider} encType="multipart/form-data">
                <div className="text-start modal-body">
                    <div className="form-group my-3">
                        {
                            xSlider.photo ?
                                <>
                                    <input type="file" accept="image/*" name="photo" onChange={handlePhoto} className="form-control form-control-lg" id="photo" aria-describedby="photo" placeholder='Slider Image' />
                                </>
                                :
                                <>
                                    <input type="file" accept="image/*" name="photo" onChange={handlePhoto} className="form-control form-control-lg" id="photo" aria-describedby="photo" placeholder='Slider Image' required />
                                </>
                        }
                    </div>
                    <div className="form-group my-3">
                        {
                            photo && <img src={photo} alt={xSlider.title} style={{ width: "100%", objectFit: "cover" }} />
                        }
                    </div>
                    <div className="form-group my-3">
                        <input type="text" name="title" value={xSlider.title} onChange={handleInput} className="form-control form-control-lg" id="title" aria-describedby="title" placeholder="Title" required />
                    </div>
                    <div className="form-group my-3">
                        <input type="text" name="caption1" value={xSlider.caption1} onChange={handleInput} className="form-control form-control-lg" id="caption1" aria-describedby="caption1" placeholder="Caption 1" />
                    </div>
                    <div className="form-group my-3">
                        <input type="text" name="caption2" value={xSlider.caption2} onChange={handleInput} className="form-control form-control-lg" id="caption2" aria-describedby="caption2" placeholder="Caption 2 " />
                    </div>
                    <div className="form-group my-3">
                        <input type="text" name="link" value={xSlider.link} onChange={handleInput} className="form-control form-control-lg" id="link" aria-describedby="link" placeholder="Link" required />
                    </div>
                    <div className="form-group my-3">
                        <input type="text" name="textcolor" value={xSlider.textcolor} onChange={handleInput} className="form-control form-control-lg" id="textcolor" aria-describedby="textcolor" placeholder="Text Color" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="reset" id="modalClose" className="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal"
                        onClick={() => {
                            setXSlider({
                                photo: "",
                                title: "",
                                caption1: "",
                                caption2: "",
                                link: "",
                                textcolor: "",
                                index: ""
                            });
                            setPhoto("");
                        }}
                    >Cancel</button>
                    <button type="submit" className="btn btn-sm btn-outline-primary">
                        {
                            add ? <span>Adding <i className="fa fa-spinner fa-spin"></i></span> : <span>Add</span>
                        }
                    </button>
                </div>
            </form>

        </>
    )
}

export default AddSlider