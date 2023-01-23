import React from 'react'

const Admin = () => { 
    const slides = [
    {
        'imgsrc':'https://i2.wp.com/myblogs.pw/wp-content/uploads/2018/08/AI-Web.jpg?fit=1034%2C480&ssl=1',
        'title':'Inductions For B20 and B21',
        'caption1':'AI CLUB Inductions for batch B20 and B21.',
        'caption2':'NITC',
        'linktitle':'Inductions',
        'link':'/competitions/ai-club-inductions'
    },
    {
      'imgsrc':'https://media.istockphoto.com/photos/artificial-intelligence-concept-picture-id1364859722?b=1&k=20&m=1364859722&s=170667a&w=0&h=o7emaeAZHOvBP1_o5ewQH9y9279rQWS9xO_xU4r-u-4=',
      'title':'Inductions For B20 and B21',
      'caption1':'AI CLUB Inductions for batch B20 and B21.',
      'caption2':'AI CLUB Inductions for batch B20 and B21.',
      'linktitle':'Inductions',
      'link':'/competitions/ai-club-inductions'
    },
    {
      'imgsrc':'https://miro.medium.com/max/657/1*MdInuEHHzcTQvjlzs8wpKA.png',
      'title':'Inductions For B20 and B21',
      'caption1':'AI CLUB Inductions for batch B20 and B21.',
      'linktitle':'Inductions',
      'link':'/competitions/ai-club-inductions',
      'color':'#99ff00'
    }
  ]
  return (
    <>
        <div className='admin-container'>
            <div className='adjust'>
                <h2 className='text-center'>Admin Panel</h2>
            </div>
            <div className='container'>
                <h4>Slider Settings</h4>
                <div className='row'>
                    <div className='col-5'>
                        {slides.map((slide)=>{
                            return(
                                <div class="card flex-row">
                                    <img className="card-img-left example-card-img-responsive" src={slide.imgsrc} alt={slide.title} style={{objectFit:"fit",width:"200px",height:"100px"}}/>
                                    <div class="card-body p-0">
                                        <div className="form-group my-1 align-items-center row">
                                            <label for="title" className='col-sm-4 text-end'>Title :</label>
                                            <div className='col-sm-8'>
                                                <input type="text" name="title" className="form-control" id="title" aria-describedby="title" placeholder={`Enter title`} required/>
                                            </div>
                                        </div>
                                        <div className="form-group my-1 align-items-center row">
                                            <label for="title" className='col-sm-4 text-end'>Title :</label>
                                            <div className='col-sm-8'>
                                                <input type="text" name="title" className="form-control" id="title" aria-describedby="title" placeholder={`Enter title`} required/>
                                            </div>
                                        </div>
                                        <div className="form-group my-1 align-items-center row">
                                            <label for="title" className='col-sm-4 text-end'>Title :</label>
                                            <div className='col-sm-8'>
                                                <input type="text" name="title" className="form-control" id="title" aria-describedby="title" placeholder={`Enter title`} required/>
                                            </div>
                                        </div>
                                        <div className="form-group my-1 align-items-center row">
                                            <label for="title" className='col-sm-4 text-end'>Title :</label>
                                            <div className='col-sm-8'>
                                                <input type="text" name="title" className="form-control" id="title" aria-describedby="title" placeholder={`Enter title`} required/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='col-7'></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Admin