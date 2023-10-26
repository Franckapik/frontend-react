import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiFetch from "../api/fetch.js";
import { Progression } from "./Progression.jsx";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ReactMarkdown from "react-markdown";

const Exercice = () => {
  const [listOfExo, setListOfExo] = useState([]);
  let { evaId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: exercices,
    isSuccess,
  } = useQuery("exercices", () =>
    fetch(`http://localhost:1337/api/exercices?populate=*&filters[evaluation]=${evaId}`).then((res) => res.json())
  );

  /*   const { isLoading: isUpdating,  mutate } = useMutation(async (evaId) => {
      return apiPost.updateProgression({
        evaluation: {
          id: evaId
        }
      }, pid)
    }, {
      onSuccess: (evaId) => {
        queryClient.invalidateQueries(['progression'])
        navigate(`/exercice/${evaId}?pid=${pid}`, { replace: true })
  
      }
    }) */

  console.log(exercices);

  return (
    <div className="">
      <div className="column m-auto p-3 has-text-centered">
        <div>
          <p className="title m-3">Exercices: </p>
        </div>
        <div>
          {/* {isSuccess &&
            exercices.data.map((exo) => (
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
            ))} */}
          {isSuccess && (
            <div>
              <div className="card">
                <div className="card-content">
                  <div className="">
                    Exercice n° {exercices.data[exo].attributes.numero} : {exercices.data[exo].attributes.titre}
                  </div>
                  <div className="content">
                    <div value={exercices.data[exo].id}>
                      <ReactMarkdown>{exercices.data[exo].attributes.contenu}</ReactMarkdown>

                      {exercices.data[exo].attributes.questions.data.map((question, i) => {
                        return (
                          <div key={"question" + i}>
                            Question {i + 1} - [{question.attributes.type}] - Niveau {question.attributes.niveau} -{" "}
                            {question.attributes.contenu}
                          </div>
                        );
                      })}
                      <div className="is-flex is-flex-wrap-wrap">
                        {exercices.data[exo].attributes.reponses.data.map((reponse, i) => {
                          return (
                            <button
                              key={"reponse" + i}
                              className="button is-primary is-info is-flex-basis50 reponse  m-3"
                            >
                              {/* {reponse.attributes.type} */} {reponse.attributes.contenu}{" "}
                              {/*  {reponse.attributes.correct ? "Vrai" : "Fausse"} */}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {exo < exercices.data.length - 1 ? (
                <button onClick={() => navigate({ search: `?exo=${Number(exo) + 1}` })}>Suivant</button>
              ) : (
                "Retour"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercice;
