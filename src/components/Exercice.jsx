import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiFetch from "../api/fetch.js";
import { Progression } from "./Progression.jsx";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Exercice = () => {

  let { evaId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("exo")
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { isLoading, error, data: exercices, isSuccess } = useQuery('exercices', () =>
    fetch(`http://localhost:1337/api/exercices?populate=*&filters[evaluation]=${evaId}`).then(res =>
      res.json()
    )
  )


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
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Exercices: </p>
        </div>
        <div>
          {isSuccess &&
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default Exercice;
