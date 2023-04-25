import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../EditableStuff/Config";
import LeaderboardSpace from "./LeaderboardSpace";
import { alertContext } from "../../Context/Alert";

const Leaderboard = ({ props }) => {

  const { showAlert } = useContext(alertContext);
  const [isCompeteEnd, SetIsCompeteEnd] = useState(false);
  const [lb, setLB] = useState([]);
  const [privateLB, setPrivateLB] = useState(false);

  const getIsCompeteEnd = async () => {
    try {
      await axios.get(`${SERVER_URL}/getIsCompeteEnd/${props.c._id}`)
        .then((res) => {
          SetIsCompeteEnd(res.data);
        })
    } catch (err) {
      console.log(err);
    }
  }

  const getLeaderboard = async () => {
    setPrivateLB(false);
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

  const getPrivateLeaderboard = async () => {
    if (isCompeteEnd) {
      setPrivateLB(true);
      try {
        axios.get(`${SERVER_URL}/getPrivateLeaderboard/${props.c._id}`)
          .then(data => {
            setLB(data.data);
            console.log('private', data.data)
          });
      } catch (err) {
        console.log(err);
      }
    }
    else {
      showAlert("Private LeaderBoard availabe after the Competition Ends","danger")
    }
  }


  useEffect(() => {
    getIsCompeteEnd();
    getLeaderboard();
  }, [props]);

  return (
    <>
      {
        <div className="leaderboard-container pt-2">
          <div className="card">
            <div className="row align-items-center p-3">
              <div className="col-sm-8">
                <h4 className="m-0">
                {
                    privateLB ?
                      <>Private</>
                      :
                      <>Public</>
                  }
                  &nbsp;Leaderboard
                </h4>
              </div>
              <div className="col-sm-4 text-end">
                <button className="btn btn-sm text-primary" onClick={() => { privateLB ? getPrivateLeaderboard() : getLeaderboard() }}>
                  Refresh
                </button>
                {(isCompeteEnd || props.access) ?
                  <button className='btn btn-outline-dark btn-sm ml-2' onClick={privateLB ? getLeaderboard : getPrivateLeaderboard}>{privateLB ? "Public" : "Private"}</button>
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
                    {privateLB && <th scope="col">Difference</th>}
                    <th scope="col">{privateLB ? "Private" : "Public"} Score</th>
                    <th scope="col">Submissions</th>
                    <th scole="col">Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    lb.map((l, index) => {
                      return (
                        <LeaderboardSpace l={l} index={index} privateLB={privateLB} key={index}/>
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