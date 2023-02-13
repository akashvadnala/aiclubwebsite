import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import PublicationSpace from "./PublicationSpace";
import Loading from "../Loading";
import Error from "../Error";
import { Context } from "../../Context/Context";
import { Helmet } from "react-helmet";

const Publications = () => {
  const { user } = useContext(Context);
  const [publications, setPublicationList] = useState(null);
  const [load, setLoad] = useState(0);

  const getPublicationsData = async () => {
    try {
      axios.get(`${SERVER_URL}/getResearchPapers`).then((data) => {
        if (data.status === 200) {
          setPublicationList(data.data);
          setLoad(1);
        } else {
          setLoad(-1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPublicationsData();
  }, [user]);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="publications-container adjust pt-4">
          <Helmet>
            <title>Publications - AI Club</title>
          </Helmet>
          <div className="row">
            <div className="col-md-4 text-center text-md-start pb-3">
              <h2>Publications</h2>
            </div>
            {publications.length ? (
              <div className="row">
                {publications.map((publication, i) => {
                  return (
                    <div className="col-12 pb-4 px-3" key={i}>
                      <PublicationSpace publication={publication} />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default Publications;
