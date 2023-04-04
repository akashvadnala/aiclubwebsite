import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Context } from '../../Context/Context';
import Error from '../Error';
import Loading from '../Loading';
import Settings from './HostPage/Settings';
import Evaluation from './HostPage/Evaluation';
import SandBoxSubbmission from './HostPage/SandBoxSubbmission';
import AllSubbmission from './HostPage/AllSubbmission';
import HostHeader from './HostPage/HostHeader';

const Host = ({ props }) => {
    const params = new useParams();
    var hpath = params.hpath;
    if (hpath === undefined) {
        hpath = "settings";
    }

    const { logged_in } = useContext(Context);
    const [page, setPage] = useState(null);
    const [load, setLoad] = useState(0);

    const getPage = async () => {
        switch (hpath) {
            case undefined:
                setPage(<Settings props={props} />);
                break;
            case "settings":
                setPage(<Settings props={props} />);
                break;
            case "evaluation":
                setPage(<Evaluation props={props} />);
                break;
            case "sandboxsubmissions":
                setPage(<SandBoxSubbmission props={props} />);
                break;
            case "allsubmissions":
                setPage(<AllSubbmission props={props} />);
                break;
            default:
                setPage(<Error />)
                break;
        }
    };

    useEffect(() => {
        if (props.access !== null) {
            if (props.access === true) {
                setLoad(1);
            }
            else {
                setLoad(-1);
            }
        }
    }, [logged_in, hpath, props]);

    useEffect(() => {
        getPage();
    }, [hpath]);

    return (
        <>
            {load === 0 ? (
                <Loading />
            ) : load === 1 ? (
                page ? (
                    <div className='host-container py-2'>
                        <div className='card'>
                            <div className='border-bottom p-3'>
                                <h4 className='m-0'>Host Controls</h4>
                            </div>
                            <div className='card-body pt-0 pb-0'>
                                <div className="row">
                                    <div className="col-lg-2"><HostHeader props={props} hpath={hpath} /></div>
                                    <div className="col-lg-10">{page}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Error />
                )
            ) : (
                <Error />
            )}
        </>
    )
}

export default Host
