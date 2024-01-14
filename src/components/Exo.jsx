import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getExo, getProgression } from "../api/fetch.js";
import { useEvaParams } from "../hooks/useEvaParams.js";
import { Questions } from "./Questions.jsx";

export const Exo = ({ exercice: exo }) => {
  const { papier, correction, pid } = useEvaParams();
  const [noteExo, setNoteExo] = useState(0);

  const { data: progression, isSuccess: isProgression } = useQuery({
    queryKey: ["progression"],
    queryFn: () => getProgression(pid),
    enabled: !!pid,
  });

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
    if (correction !== null ) {
      const pointsExo = progression?.data[0]?.attributes.note[exo.id] || false;
      if (pointsExo) {
        const note = Object.values(pointsExo).reduce(
          (acc, val) => (acc += val),
          0
        );
        setNoteExo(note);  
      }
    }
  }, [isProgression]);

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <div className="card m-3 has-background-light is-shadowless">
        <div className="card-content">
          <div className={papier !== null ? `is-underlined card-header mb-4  is-shadowless` : ` mb-2 `}>
            Exercice {exo.attributes.numero} : {exo.attributes.titre} {correction !== null ? noteExo : ""} /{" "}
            {exo.attributes.score}
          </div>
          <div className="content">
            <div>
              <ReactMarkdown>{exo.attributes.contenu}</ReactMarkdown>
              {questions.data.map((question, i) => (
                <Questions key={"questions" + i} question={question} exid={exo.id} index={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};
