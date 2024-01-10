import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { getExo } from "../api/fetch.js";
import { Question } from "./Question.jsx";
import { useEvaParams } from "../hooks/useEvaParams.js";

export const Exo = ({ exercice: exo, setPointsEva, setCompsEva }) => {
  const { papier, correction } = useEvaParams();
  const [pointsExo, setPointsExo] = useState(0);

  const {
    data: questions,
    isSuccess,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["questions" + exo.id],
    queryFn: () => getExo(exo.id),
  });

  /* const { data: completion } = useQuery(
    "completions" + "E" + exo.id,
    () =>
      fetch(
        `https://strapi.eva-svt.ovh/api/completions?populate=deep&filters[progression]=${pid}&filters[exercice]=${exo.id}`
      ).then((res) => res.json()),
    {
      onSuccess: (completions) => {
        const pointsExo = completions.data?.reduce((acc, val) => (acc += val.attributes.points), 0);
        /*   const essai = completion.data?.reduce((acc,val) => {
          const obj = {}
          obj[val.attributes.validation[0]?.competence.data?.id] = val.attributes.validation[0]?.niveau
          console.log(obj);
          let moy = 
          acc = {...acc, ...obj}
          return acc
       
        }, {}
        )
 
           const essai = completion.data.map((a) => {
          const validation = a.attributes.validation[0]
          const compId = a.attributes.validation[0].competence.data?.id
          return {exo : exo.id, competence : compId, niveau : validation.niveau}
        })
        const essai2 = essai.reduce((acc, val) => (
          acc = val.niveau / 2
        ), {})
        setCompsEva((prev) => ({ ...prev, ...essai })); 

        setPointsExo(pointsExo);
        const pts = {};
        pts["exo" + exo.id] = pointsExo;
        setPointsEva((prev) => ({ ...prev, ...pts }));
      },
    }
  ); */
  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <div className="card m-3 has-background-light is-shadowless">
        <div className="card-content">
          <div className={papier !== null ? `is-underlined card-header mb-4  is-shadowless` : ` mb-2 `}>
            Exercice {exo.attributes.numero} : {exo.attributes.titre} {correction !== null ? pointsExo : ""} /{" "}
            {exo.attributes.score}
          </div>
          <div className="content">
            <div>
              <ReactMarkdown>{exo.attributes.contenu}</ReactMarkdown>
              {questions.data.map((question, i) => (
                <Question key={"question" + i} question={question} exid={exo.id} index={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};
