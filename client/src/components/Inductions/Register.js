import React from 'react';

const Register = (props) => {
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
            <h3>Register</h3>
            <form>
                {
                    forms.map((f)=>{
                        return(
                            <div class="form-group my-3 row">
                                <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                <div className='col-sm-10'>
                                    <input type={f.type} class="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} />
                                </div>
                            </div>
                        )
                    })
                }
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </>
  )
}

export default Register;