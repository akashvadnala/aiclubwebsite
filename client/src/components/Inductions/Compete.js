import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Data from './Data';
import Leaderboard from './Leaderboard';
import Overview from './Overview';
import Register from './Register';
import Error from '../Error';
import InductionsHeader from './InductionsHeader';
import Competitions from '../../EditableStuff/Competitions';


const Compete = () => {
    const navigate = useNavigate();
    const params = new useParams();
    var path = params.path;
    const spath = params.spath;
    console.log("spath",spath);
    console.log("path",path);
    console.log('competitions',Competitions);
    // if(!path) path=null;
    var page=null;
    const c = Competitions.hasOwnProperty(spath);
    var c1=null;
    var p=true;
    console.log('c',c);
    if(c){
        c1 = Competitions[spath];
        console.log('c1',c1);
        if(path){
            p = c1.navs.hasOwnProperty(path);
        }
        console.log('p',p);
        if(p){
            switch (path) {
                case undefined:
                    page = <Overview title={c1.title} />
                    break;
                case "data":
                    page = <Data title={c1.title} />
                    break;
                case "leaderboard":
                    page = <Leaderboard title={c1.title} />
                    break;
                case "submissions":
                    page = <Overview title={c1.title} />
                    break;
                case "register":
                    page = <Register title={c1.title} />
                    break;
                            
                default:
                    break;
            }
        }
    }
    
    
  return (
    <>
        {
        page?
            <div className='compete-container'>
                <div className='adjust'>
                    <InductionsHeader c={c1}/>
                    {page}
                </div>
            </div>
        :
            <Error />
    }
        
    </>
  )
}

export default Compete