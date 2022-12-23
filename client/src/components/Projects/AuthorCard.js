import React from 'react';
import TextTruncate from 'react-text-truncate';

const AuthorCard = (props) => {
  return (
    <>
        <div className='container authorcard-container row my-3 p-3 border border-light bg-light rounded'>
            <div className='col-4 p-1'>
                <img alt={props.a.firstname} src={props.a.photo} className="rounded-circle"/>
            </div>
            <div className='proj-desc col-8 pl-3'>
                <h6>{props.a.firstname} {props.a.lastname}</h6>
                <TextTruncate title={props.a.description} line={2} element="p" truncateText='' text={props.a.description} textTruncateChild="..." />
            </div>
        </div>
    </>
  )
}

export default AuthorCard;