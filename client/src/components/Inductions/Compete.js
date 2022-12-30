import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Data from './Data';
import Leaderboard from './Leaderboard';
import Overview from './Overview';
import Register from './Register';
import Error from '../Error';
import Loading from '../Loading';
import InductionsHeader from './InductionsHeader';
import Submissions from './Submissions';
import axios from 'axios';
import { SERVER_URL } from '../../EditableStuff/Config';
import Host from './Host';
import { Context } from '../../Context/Context';
// import Competitions from '../../EditableStuff/Competitions';


const Compete = () => {
    const params = new useParams();
    var path = params.path;
    const spath = params.spath;
    console.log("spath",spath);
    console.log("path",path);
    const {user} = useContext(Context);
    const [ page, setPage ] = useState(null);
    const [ comp, setComp ] = useState([]);
    const [ load, setLoad ] = useState(0);
    const [ hostAccess, setHostAccess ] = useState(false);
    const getCompete = async () => {
        try{
            axios.get(`${SERVER_URL}/getCompete/${spath}`)
            .then(data => {
                if(data.status===201){
                    if(user && data.data.access.indexOf(user.username)>-1){
                        console.log('accesss');
                        setHostAccess(true);
                    }
                    setComp(data.data);
                    setLoad(1);
                }
                else{
                    console.log('Competition not found');
                    setLoad(-1);
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
                setPage(<Overview c={comp} access={hostAccess} />);
                break;
            case 'overview':
                setPage(<Overview c={comp} access={hostAccess} />);
                break;
            case 'host':
                setPage(<Host c={comp} access={hostAccess} />);
                break;
            case 'data':
                setPage(<Data c={comp} access={hostAccess} />);
                break;
            case 'leaderboard':
                setPage(<Leaderboard c={comp} access={hostAccess} />);
                break;
            case 'submissions':
                setPage(<Submissions c={comp} access={hostAccess} />);
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
        {load===0?<Loading />:load===1?
            page?
                <div className='compete-container'>
                    <div className='adjust'>
                        <InductionsHeader c={comp} access={hostAccess} />
                        {page}
                    </div>
                </div>
            :
                <Error />
        :<Error />}
    </>
  )
}

export default Compete;