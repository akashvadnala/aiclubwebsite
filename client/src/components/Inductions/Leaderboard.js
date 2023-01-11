import React from "react";

const Leaderboard = (props) => {
    return(
        <>
            {
                <div className="leaderboard-container">
                    <div className="border">
                    <div className='row p-3 pb-1'>
                        <div className='col-sm-8'>
                        <h5>Leaderboard</h5>
                        </div>
                        <div className='col-sm-4 text-end'>
                        {props.access?
                            <>
                                <button className='btn btn-outline-dark btn-sm mx-1' >Public</button>
                                <button className='btn btn-outline-dark btn-sm mx-1' >Private</button>
                            </>
                            :
                            null
                        }
                        </div>
                    </div>
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
    );
}

export default Leaderboard;