import React from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import { Question } from "./Question.jsx";
import { useSearchParams } from "react-router-dom";

export const Exo = ({ exercice : exo }) => {
  const { data: questions, isSuccess: isQuestioning } = useQuery("questions" + exo.id, () =>
    fetch(`http://localhost:1337/api/questions?populate=*&filters[exercice]=`+ exo.id).then((res) => res.json())
  );
  
  const [searchParams, setSearchParams] = useSearchParams();

  const papier = searchParams.get("papier");

  return (
    <div className="card bg-light-50">
      <div className="card-content">
        <div className={papier!== null ? `is-underlined`  : ``}
>
          Exercice {exo.attributes.numero} : {exo.attributes.titre}
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
