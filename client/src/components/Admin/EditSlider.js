import React from 'react'

const EditSlider = () => {
    return (
        <>
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="sliderModalLabel">Add Slider</h1>
            </div>

            <form method="POST" encType="multipart/form-data">
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
                    <button type="reset" id="modalClose" className="btn btn-sm btn-secondary" data-bs-dismiss="modal"
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
                    {
                        addOrEdit ?
                            <button type="submit" onClick={updateSlider} className="btn btn-sm btn-primary">
                                {
                                    edit ? <span>Updating <i class="fa fa-spinner fa-spin"></i></span> : <span>Update</span>
                                }
                            </button>
                            :
                            <button type="submit" onClick={addSlider} className="btn btn-sm btn-primary">
                                {
                                    add ? <span>Adding <i class="fa fa-spinner fa-spin"></i></span> : <span>Add</span>
                                }
                            </button>
                    }
                </div>
            </form>

        </>
    )
}

export default EditSlider