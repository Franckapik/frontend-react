import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiFetch from "../api/fetch.js";
import * as apiPost from "../api/post.js";
import moment from "moment";
moment.locale('fr');
import { Progression } from "./Progression.jsx";

const Evaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [classe, setClasse] = useState([]);
  const [evaId, setEvaId] = useState([]);
  let { classeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch.fetchByClasseId(classeId);
      setEvaluations(result.data[0].attributes.evaluations.data);
      setClasse(result.data[0].attributes.Classe);
    };
    fetchData();
  }, [classeId]);

  const setEvaluationInProgression = async (eva_id) => {
    const result = await apiPost.updateProgression({
      evaluation: {
        id: eva_id
      },
      debut : moment()
      

    }, pid);

    navigate(`/exercice/${eva_id}?pid=${pid}`, { replace: true })

  };

  return (
    <div className="is-flex h-100 columns is-flex is-vcentered ">
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Evaluations: </p>
        </div>
        <div>
          {evaluations.length > 0 ?
            <div>
              {evaluations.map((eva) => (

                <div key={"eva"+eva.id} onClick={() => setEvaluationInProgression(eva.id)} className="card">{eva.attributes.Nom}</div>
              ))}
            </div> : "Pas d'evaluation pour cette classe"}

        </div>
      </div>
    </div>
  );
};

export default Evaluation;
