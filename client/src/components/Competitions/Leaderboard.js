import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import LeaderboardSpace from "./LeaderboardSpace";

const Leaderboard = ({ props }) => {
  const [lb, setLB] = useState([]);
  const getLeaderboard = async () => {
    try {
      axios.get(`${SERVER_URL}/getLeaderboard/${props.c._id}`)
        .then(data => {
          const filteredData = data.data.filter(lb => lb.numSubmissions > 0);
          setLB(filteredData);
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
                <button className="btn btn-sm text-primary" onClick={()=>{getLeaderboard()}}>
                  Refresh
                </button>
                {props.access ?
                  <>
                    <button className='btn btn-dark btn-sm ml-2' >Public</button>
                    <button className='btn btn-dark btn-sm ml-2' >Private</button>
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
                        <LeaderboardSpace l={l} index={index} key={index}/>
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