import React from 'react';

const Register = ({props}) => {
    const forms=[
        {
            'type':'text',
            'id':'firstname',
            'des':'First Name'
        },
        {
            'type':'text',
            'id':'lastname',
            'des':'Last Name'
        },
        {
            'type':'email',
            'id':'email',
            'des':'EMail'
        },
        {
            'type':'password',
            'id':'password',
            'des':'Password'
        },
        {
            'type':'password',
            'id':'cpassword',
            'des':'Confirm Password'
        }
    ]
  return (
    <>
        <div className='register-container'>
            <p>This is {props.title}</p>
            <h4>{props.path}</h4>
            <form>
                {
                    forms.map((f)=>{
                        return(
                            <div className="form-group my-3 row">
                                <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                <div className='col-sm-10'>
                                    <input type={f.type} className="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} />
                                </div>
                            </div>
                        )
                    })
                }
                <button type="submit" className="btn btn-outline-primary">Submit</button>
            </form>
        </div>
    </>
  )
}

export default Register;