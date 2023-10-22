import React, { useEffect, useState } from "react";
import * as apiFetch from "../api/fetch.js";
import * as apiPost from "../api/post.js";
import moment from "moment";
moment.locale('fr');
import { Progression } from "./Progression.jsx";
import { useNavigate } from "react-router-dom";
import { Competences } from "./Competences.jsx";


const Classe = () => {
  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState(1);
  const [progressionId, setProgressionId] = useState(0);
  const sessionPid = sessionStorage.getItem("sessionPid");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch.fetchClasses();
      setClasses(result.data);
    };

    fetchData();

    const postNewProgression = async () => {
      const result = await apiPost.postProgression({
        contenu: "my first post",
        creation: moment()
      });
      console.log("Nouvelle session");
      sessionStorage.setItem("sessionPid", result.data.id)
      setProgressionId(result.data.id)
    };

    const updateProgression = async () => {
      const result = await apiPost.updateProgression({
        reprise: moment()
      }, sessionPid);
      console.info("Reprise de la session numero "+ sessionPid )
      setProgressionId(sessionPid)
      navigate({search : `?pid=${sessionPid}`})
    };

    if (sessionPid == null) {
      postNewProgression();
    } else {
      updateProgression();

    }

  }, [sessionPid]);

  return (
    <div className="is-flex h-100 columns is-flex is-vcentered ">
     <Competences></Competences>
      <Progression></Progression>
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Dans quelle classe est-tu ? </p>
        </div>
        <div>
          {classes.length > 0 && (
            <select
              name="classes"
              id="classes-select"
              className="select is-large m-5"
              onChange={(e) => setClasseId(e.target.value)}
            >
              {classes.map((classe) => (
                <option key={"classe"+classe.id} value={classe.id}>{classe.attributes.Classe}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <a href={`/eleve/${classeId}?pid=${progressionId}`}> Suite </a>

        </div>
      </div>
    </div>
  );
};

export default Classe;
