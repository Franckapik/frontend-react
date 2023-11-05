import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import { Question } from "./Question.jsx";
import { useSearchParams } from "react-router-dom";

export const Exo = ({ exercice: exo, setPointsEva, setCompsEva }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const papier = searchParams.get("papier");
  const pid = searchParams.get("pid");
  const correction = searchParams.get("correction");


  const [pointsExo, setPointsExo] = useState(0);

  const { data: questions, isSuccess: isQuestioning } = useQuery("questions" + exo.id, () =>
    fetch(`http://localhost:1337/api/questions?populate=*&filters[exercice]=` + exo.id).then((res) => res.json())
  );

  const { data: completion } = useQuery(
    "completions" + "E" + exo.id,
    () =>
      fetch(
        `http://localhost:1337/api/completions?populate=deep&filters[progression]=${pid}&filters[exercice]=${exo.id}`
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
 */
      /*   const essai = completion.data.map((a) => {
          const validation = a.attributes.validation[0]
          const compId = a.attributes.validation[0].competence.data?.id
          return {exo : exo.id, competence : compId, niveau : validation.niveau}
        })
        const essai2 = essai.reduce((acc, val) => (
          acc = val.niveau / 2
        ), {})
        setCompsEva((prev) => ({ ...prev, ...essai })); */

        setPointsExo(pointsExo);
        const pts = {};
        pts["exo" + exo.id] = pointsExo;
        setPointsEva((prev) => ({ ...prev, ...pts }));
      },
    }
  );
  

  return (
    <div className="card bg-light-50">
      <div className="card-content">
        <div className={papier !== null ? `is-underlined` : ``}>
          Exercice {exo.attributes.numero} : {exo.attributes.titre} {correction !== null ? pointsExo : ""} / {exo.attributes.score}
        </div>
        <div className="content">
          <div>
            <ReactMarkdown>{exo.attributes.contenu}</ReactMarkdown>
            {isQuestioning && questions.data.length > 0
              ? questions.data.map((question, i) => <Question question={question} exo={exo} index={i + 1} />)
              : "Pas de questions"}
          </div>
        </div>
      </div>
    </div>
  );
};
