import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import MySubmissionSpace from "./MySubmissionSpace";
import Loading from "../Loading";
import Error from "../Error";

const MySubmissions = ({ props }) => {

    const [lb, setLB] = useState([]);
    const [competeUser, setCompeteUser] = useState();
    const [load, setLoad] = useState(0);

    const getCompeteUserData = async () => {
        try{
            await axios.get(`${SERVER_URL}/getCompeteUserData`, { withCredentials: true })
            .then(async data => {
                setCompeteUser(data.data);
            })
        }catch(err){
            setLoad(-1);
        }
    }
    useEffect(() => {
        getCompeteUserData();
    }, [props.c])

    const getMySubmissions = async () => {
        try {
            axios.get(`${SERVER_URL}/getMySubmissions/${props.c._id}/${competeUser._id}`, { withCredentials: true })
                .then(data => {
                    setLB(data.data);
                    setLoad(1);
                });
        } catch (err) {
            console.log(err);
            setLoad(-1);
        }
    }
    useEffect(() => {
        if (competeUser) {
            getMySubmissions();
        }
    }, [props.c, competeUser]);
    return (
        <>
            {load === 0 ? <Loading /> : load === 1 ?
                <div className="mysubmissions-container pt-2">
                    <div className="card">
                        <div className="row align-items-center p-3">
                            <div className="col-sm-8">
                                <h4 className="m-0">My Submissions</h4>
                            </div>
                            <div className="col-sm-4 text-end">
                                <button className="btn btn-sm text-primary" onClick={() => { getMySubmissions() }}>
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div className="border-top px-3">
                            <table className="table table-striped">
                                <thead className="">
                                    <tr>
                                        <th scope="col">S.No.</th>
                                        {/* <th scope="col">Team Name</th> */}
                                        <th scope="col">Score</th>
                                        {/* <th scope="col">Submissions</th> */}
                                        <th scole="col">Last Submission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        lb.map((l, index) => {
                                            return (
                                                // <tr>
                                                //     <th scope="row">{index + 1}</th>
                                                //     {/* <th>{names[index]}</th> */}
                                                //     {/* <th>{l.team}</th> */}
                                                //     <th>{l.publicScore['$numberDecimal'].toLocaleString()}</th>
                                                //     {/* <th>{l.numSubmissions}</th> */}
                                                //     <th>{l.createdAt}</th>
                                                // </tr>
                                                <MySubmissionSpace l={l} index={index} />
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
                : <Error />}
        </>
    );
}

export default MySubmissions;