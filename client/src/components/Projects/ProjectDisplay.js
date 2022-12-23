import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SERVER_URL } from '../../EditableStuff/Config';
import Error from '../Error';
import Loading from '../Loading';
import AuthorCard from './AuthorCard';

const ProjectDisplay = () => {
    const {url} = useParams();
    
    var project=null;
    const [ proj, setProj ] = useState({
        title:'',
        content:'',
        creator:'',
        authors:[],
    });
    const [ authors, setAuthors ] = useState([]);
    const [ load ,setLoad ] = useState(0);

    const getProject = async () =>{
        try{
            const data = await axios.get(`${SERVER_URL}/getProject/${url}`)
            console.log('project',data.data.project);
            if(data.status!==200){
                setLoad(-1);
                return;
            }
            project=data.project;
            setProj(data.data.project);
            setAuthors(data.data.authors);
            setLoad(1);
        }catch(err){
            console.log(err);
        }
        
        

    }
    
    useEffect(()=>{
        getProject();
    },[])


    return (
        <>
            {load===0?
            <Loading />
            :load===1?
            <div className='container projectdisplay-container pt-5 pb-5'>
                <div className='row'>
                    <div className='col-lg-8 px-5'>
                        <h3 className='text-center pb-3'>{proj.title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: proj.content }}></p>
                    </div>
                    <div className='col-lg-4'>
                        {authors.map((a)=>{
                            return(
                                <>
                                    <AuthorCard a={a} />
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
            :
            <Error />}
        </>
    )
}

export default ProjectDisplay;