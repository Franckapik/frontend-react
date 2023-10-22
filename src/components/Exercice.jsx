import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as apiFetch from "../api/fetch.js";
import { Progression } from "./Progression.jsx";

const Exercice = () => {
  const [exercices, setExercices] = useState([]);
  const [classe, setClasse] = useState([]);
  const [eleveId, setEleveId] = useState([]);
  let { evaId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch.fetchExerciceByEvaId(evaId);
      setExercices(result.data);
    };
    fetchData();
  }, [evaId]);

  return (
    <div className="is-flex h-100 columns is-flex is-vcentered ">
     <Progression></Progression>
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Exercices: </p>
        </div>
        <div>
          {exercices.length > 0 &&
            exercices.map((exo) => (
              <div key={"exo" + exo.id} className="card m-2">
                <li value={exo.id}>
                  Exercice n° {exo.attributes.numero} : {exo.attributes.titre}
                </li>
                <div value={exo.id}>
                  {exo.attributes.contenu}
                  <p> Questions :</p>
                  {exo.attributes.questions.data.map((question, i) => {
                    return <li>{question.attributes.type} {question.attributes.contenu}</li>;
                  })}
                  <p> Reponses :</p>
                  {exo.attributes.reponses.data.map((reponse, i) => {
                    return <li>{reponse.attributes.type} {reponse.attributes.contenu} {reponse.attributes.correct? "Vrai" : "Fausse"}</li>;
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Exercice;
