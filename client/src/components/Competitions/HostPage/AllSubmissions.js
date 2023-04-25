import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../EditableStuff/Config";
import AllSubmissionsSpace from "./AllSubmissionsSpace";

const AllSubmissions = ({ props }) => {
  const [lb, setLB] = useState([]);
  const getLeaderboard = async () => {
    try {
      axios.get(`${SERVER_URL}/getAllSubmissions/${props.c._id}`)
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
                <h4 className="m-0">All Submissions</h4>
              </div>
              <div className="col-sm-4 text-end">
                <button className="btn btn-sm text-primary" onClick={() => { getLeaderboard() }}>
                  Refresh
                </button>
              </div>
            </div>
            <div className="border-top px-3">
              <table className="table table-striped">
                <thead className="">
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Public Score</th>
                    <th scope="col">Private Score</th>
                    <th scope="col">Submissions</th>
                    <th scole="col">Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    lb.map((l, index) => {
                      return (
                        // <tr>
                        //   <th scope="row">{index + 1}</th>
                        //   {/* <th>{names[index]}</th> */}
                        //   <th>{l.team}</th>
                        //   <th>{l.maxPublicScore['$numberDecimal'].toLocaleString()}</th>
                        //   <th>{l.numSubmissions}</th>
                        //   <th>{l.updatedAt}</th>
                        // </tr>
                        <AllSubmissionsSpace l={l} index={index} />
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

export default AllSubmissions;