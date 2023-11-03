import React from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import { Question } from "./Question.jsx";

export const Exo = ({ exercice : exo }) => {
  const { data: questions, isSuccess: isQuestioning } = useQuery("questions" + exo.id, () =>
    fetch(`http://localhost:1337/api/questions?populate=*&filters[exercice]=`+ exo.id).then((res) => res.json())
  );

  return (
    <div className="card bg-light-50">
      <div className="card-content">
        <div className="">
          Exercice n° {exo.attributes.numero} : {exo.attributes.titre}
        </div>
        <div className="content">
          <div>
            <ReactMarkdown>{exo.attributes.contenu}</ReactMarkdown>
            {isQuestioning && questions.data.length > 0
              ? questions.data.map((question) => <Question question={question} />)
              : "Pas de questions"}
          </div>
        </div>
      </div>
    </div>
  );
};
