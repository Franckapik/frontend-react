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


  return (
    <div className="">
      <div className="column m-auto p-3 has-text-centered">
        <div>
        <nav className="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
  <ul>
    <li><a href="#">Evaluation</a></li>
    <li><a href="#">Exercice 1 </a></li>
    <li className="is-active"><a href="#" aria-current="page">Exercice 2</a></li>
  </ul>
</nav>
        </div>
        <div>
          {isSuccess && (
            <div>
              <div className="card bg-light-50">
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
