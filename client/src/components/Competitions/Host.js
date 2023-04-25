import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { SERVER_URL } from '../../EditableStuff/Config';
import { Context } from '../../Context/Context';
import { alertContext } from "../../Context/Alert";
import Error from '../Error';
import Loading from '../Loading';
import Settings from './HostPage/Settings';
import Evaluation from './HostPage/Evaluation';
import SandBoxSubbmission from './HostPage/SandBoxSubbmission';
import AllSubmissions from './HostPage/AllSubmissions';
import HostHeader from './HostPage/HostHeader';

const Host = ({ props }) => {
    const params = new useParams();
    var hpath = params.hpath;
    if (hpath === undefined) {
        hpath = "settings";
    }

    const { showAlert } = useContext(alertContext);
    const { logged_in } = useContext(Context);
    const [compete, setCompete] = useState(null);
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
                setPage(<AllSubmissions props={props} />);
                break;
            default:
                setPage(<Error />)
                break;
        }
    };

    const publishCompetetion = async () => {
        setCompete({ ...compete, public: !compete.public })
        await axios.put(`${SERVER_URL}/publishCompetetion/${props.c._id}`,
            {
                public: !compete.public
            },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
        );
        if (!compete.public) {
            showAlert("Competition published Successfully!", "success");
        } else {
            showAlert("Competition made Private Successfully!", "success");
        }

    }

    const getPublishingApproval = async () => {
        const data = await axios.get(`${SERVER_URL}/getPublishingApproval/${props.c._id}`)
        showAlert(data.data.msg, data.data.approval ? "success" : "danger");
        return data.data.approval
    }

    useEffect(() => {
        setCompete(props.c);
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
                            <div className='border-bottom row justify-content-between p-3'>
                                <h4 className='col-2 m-0'>Host Controls</h4>
                                <button className='col-2 m-0 btn btn-sm btn-outline-dark' onClick={async() => {
                                    if (!compete.public) {
                                        var approval = await getPublishingApproval();
                                        if (approval) {
                                            publishCompetetion();
                                        }
                                    }
                                    else {
                                        publishCompetetion();
                                    }
                                }}>{compete.public ? "Make Private" : "Publish Competition"}</button>
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
