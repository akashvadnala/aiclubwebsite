import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Data from './Data';
import Leaderboard from './Leaderboard';
import Overview from './Overview';
import Rules from './Rules';
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
    const {user,logged_in} = useContext(Context);
    const [ page, setPage ] = useState(null);
    const [ comp, setComp ] = useState([]);
    const [ load, setLoad ] = useState(0);
    const [ hostAccess, setHostAccess ] = useState(false);
    const [isJoined,setIsJoined] = useState(false);
  const getCompete = async () => {
    try{
        axios.get(`${SERVER_URL}/getCompete/${spath}`)
        .then(data => {
            if(data.status===200){
                if(user){
                    if(data.data.access.indexOf(user.username)>-1){
                        setHostAccess(true);
                    }

                    axios.get(`${SERVER_URL}/isJoined/${data.data.url}/${user.username}`)
                    .then(res=>{
                        setIsJoined(res.data);
                    });
                }
                console.log('data.data',data.data);
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
        setLoad(-1);
    }
    }
    
    useEffect(() => {
        setIsJoined(false);
        setHostAccess(false);
        getCompete();
    },[logged_in,spath]);

    const parameters = {
        c:comp,
        access:hostAccess,
        username:user?user.username:null,
        isJoined:isJoined
    }
    const getPage = async (path) => {
        console.log('comp',comp);
        // window.history.replaceState()
        switch (path) {
            case undefined:
                setPage(<Overview props={parameters} />);
                break;
            case 'overview':
                setPage(<Overview props={parameters} />);
                break;
            case 'host':
                setPage(<Host props={parameters} />);
                break;
            case 'data':
                setPage(<Data props={parameters} />);
                break;
            case 'leaderboard':
                setPage(<Leaderboard props={parameters} />);
                break;
            case 'rules':
                setPage(<Rules props={parameters} />);
                break;
            case 'submissions':
                setPage(<Submissions props={parameters} />);
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
    },[comp,path,isJoined]);

  return (
    <>
        {load===0?<Loading />:load===1?
            page?
                <div className='compete-container'>
                    <div className='adjust'>
                        <InductionsHeader props={parameters} />
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