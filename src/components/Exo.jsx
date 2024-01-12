import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getExo } from "../api/fetch.js";
import { useEvaParams } from "../hooks/useEvaParams.js";
import { Questions } from "./Questions.jsx";

export const Exo = ({ exercice: exo, setPointsEva, setCompsEva }) => {
  const { papier, correction } = useEvaParams();
  const [pointsExo, setPointsExo] = useState(false);

  const {
    data: questions,
    isSuccess,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["questionsExo" + exo.id],
    queryFn: () => getExo(exo.id),
  });

  useEffect(() => {
    if(pointsExo && correction === null) {
      console.log("Questions points:" , pointsExo);
      const e = Object.values(pointsExo).reduce((acc, val) => acc + val);
      const newPoints = {};
      newPoints[exo.id] = e;
      setPointsEva((old) => ({ ...old, ...newPoints }));
    }
  }, [pointsExo]);


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
                <Questions
                  key={"questions" + i}
                  question={question}
                  setPointsExo={setPointsExo}
                  exid={exo.id}
                  index={i + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};
