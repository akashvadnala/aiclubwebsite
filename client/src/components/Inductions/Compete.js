import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Data from './Data';
import Leaderboard from './Leaderboard';
import Overview from './Overview';
import Register from './Register';
import Error from '../Error';
import InductionsHeader from './InductionsHeader';
import Submissions from './Submissions';
import axios from 'axios';
import { SERVER_URL } from '../../EditableStuff/Config';
// import Competitions from '../../EditableStuff/Competitions';


const Compete = () => {
    const params = new useParams();
    var path = params.path;
    const spath = params.spath;
    console.log("spath",spath);
    console.log("path",path);
    const [ page, setPage ] = useState(null);
    const [ comp, setComp ] = useState([]);

    const getCompete = async () => {
        try{
            axios.get(`${SERVER_URL}/getCompete/${spath}`)
            .then(data => {
                if(data.status===201){
                    setComp(data.data);
                }
                else{
                    console.log('Competition not found');
                }
            })
        }catch(err){
            console.log('Connot get Compete data');
        }
    }
    
    useEffect(() => {
        getCompete();
    },[]);

    const getPage = async (path) => {
        console.log('comp',comp);
        // window.history.replaceState()
        switch (path) {
            case undefined:
                setPage(<Overview c={comp} />);
                break;
            case 'overview':
                setPage(<Overview c={comp} />);
                break;
            case 'data':
                setPage(<Data c={comp} />);
                break;
            case 'leaderboard':
                setPage(<Leaderboard c={comp} />);
                break;
            case 'submissions':
                setPage(<Submissions c={comp} />);
                break;
            case 'register':
                setPage(<Register c={comp} />);
                break;
            default:
                break;
        }
        console.log('page',page);
    }

    useEffect(() => {
        getPage(path);
    },[comp,path]);

    const keys = {
        'overview':'Overview',
        'data':'Data',
    }

  return (
    <>
        {
            page?
                <div className='compete-container'>
                    <div className='adjust'>
                        <InductionsHeader url={spath} title={comp.title} description={comp.description} />
                        {page}
                    </div>
                </div>
            :
                <Error />
        }
    </>
  )
}

export default Compete;