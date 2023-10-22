import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as apiFetch from "../api/fetch.js";

const Exercice = () => {
  const [exercices, setExercices] = useState([]);
  const [classe, setClasse] = useState([]);
  const [eleveId, setEleveId] = useState([]);
  let { evaId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch.fetchExerciceByEvaId(evaId);
      console.log(result);
      setExercices(result.data);
    };
    fetchData();
  }, [evaId]);

  return (
    <div className="is-flex h-100 columns is-flex is-vcentered ">
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Exercices: </p>
        </div>
        <div>
          {exercices.length > 0 &&
            exercices.map((exo) => (
              <div className="card m-2">
                <li value={exo.id}>
                  Exercice n° {exo.attributes.numero} : {exo.attributes.titre}
                </li>
                <li value={exo.id}>
                  {exo.attributes.contenu}
                  <p> Questions :</p>
                  {exo.attributes.questions.data.map((question, i) => {
                    return <li>{question.attributes.type} {question.attributes.contenu}</li>;
                  })}
                  <p> Reponses :</p>
                  {exo.attributes.reponses.data.map((reponse, i) => {
                    return <li>{reponse.attributes.type} {reponse.attributes.contenu} {reponse.attributes.correct? "Vrai" : "Fausse"}</li>;
                  })}
                </li>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Exercice;
