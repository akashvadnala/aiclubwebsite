import React from 'react'
import { useParams } from 'react-router-dom'

const ProjectDisplay = () => {
    const {url} = useParams();
    return (
        <>
            <div className='container projectdisplay-container'>
                <div className='adjust'>

                </div>
            </div>
        </>
    )
}

export default ProjectDisplay