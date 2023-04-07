import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import { json } from "react-router-dom";
const Leaderboard = ({ props }) => {
  const [lb, setLB] = useState([]);
  const [count, setCount] = useState(1);
  const getLeaderboard = async () => {
    try {
      axios.get(`${SERVER_URL}/getLeaderboard/${props.c._id}`)
        .then(data => {
            setLB(data.data);
        });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getLeaderboard();
  }, [props]);
  return (
    <>
      {
        <div className="leaderboard-container pt-2">
          <div className="card">
            <div className="row align-items-center p-3">
              <div className="col-sm-8">
                <h4 className="m-0">Leaderboard</h4>
              </div>
              <div className="col-sm-4 text-end">
                {props.access ?
                  <>
                    <button className='btn btn-dark btn-sm mx-1' >Public</button>
                    <button className='btn btn-dark btn-sm mx-1' >Private</button>
                  </>
                  :
                  null
                }
              </div>
            </div>
            <div className="border-top px-3">
              <table className="table table-striped">
                <thead className="">
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Score</th>
                    <th scope="col">Submissions</th>
                    <th scole="col">Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    lb.map((l, index) => {
                      return (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <th>{l.team}</th>
                          <th>{l.maxPublicScore['$numberDecimal'].toLocaleString()}</th>
                          <th>{l.numSubmissions}</th>
                          <th>{l.updatedAt}</th>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>

          </div>
        </div>
      }
    </>
  );
}

export default Leaderboard;