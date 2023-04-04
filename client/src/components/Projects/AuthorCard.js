import React from 'react';
import TextTruncate from 'react-text-truncate';

const AuthorCard = ({a}) => {
  return (
    <>
        <div className='container authorcard-container row my-3 p-3 border border-light bg-light rounded'>
            <div className='col-4 p-1'>
                <img alt={a.firstname} src={a.photo} className="rounded-circle"/>
            </div>
            <div className='proj-desc col-8 pl-3'>
                <h6>{a.firstname} {a.lastname}</h6>
                {/* <TextTruncate title={a.description} line={2} element="p" truncateText='' text={a.description} textTruncateChild="..." /> */}
                <p>{a.position}</p>
                <p>{a.profession}</p>
            </div>
        </div>
    </>
  )
}

export default AuthorCard;