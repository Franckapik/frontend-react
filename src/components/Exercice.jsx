import React from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Question } from "./Question.jsx";
import { Breadcrumb } from "./BreadCrumb.jsx";

const Exercice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const pid = searchParams.get("pid");
  const cid = searchParams.get("cid");
  const eid = searchParams.get("eid");
  const uid = searchParams.get("uid");

  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data: exercices,
    isSuccess,
  } = useQuery("exercices", () =>
    fetch(`http://localhost:1337/api/exercices?populate=*&filters[evaluation]=${eid}`).then((res) => res.json())
  );

  const { data: questions, isSuccess: isQuestioning } = useQuery(
    "questions",
    () =>
      fetch(`http://localhost:1337/api/questions?populate=*&filters[exercice]=${exercices.data[exo].id}`).then((res) =>
        res.json()
      ),
    {
      enabled: !!exercices,
    }
  );

  return (
    <div>
      {isSuccess && (
        <Breadcrumb exercices={exercices} setSearchParams={setSearchParams} searchParams={searchParams} exo={exo} />
      )}
      <div className="is-size-4">
        {isSuccess && exercices.data[exo] && (
          <div>
            <div className="card bg-light-50">
              <div className="card-content">
                <div className="">
                  Exercice n° {exercices.data[exo].attributes.numero} : {exercices.data[exo].attributes.titre}
                </div>
                <div className="content">
                  <div value={exercices.data[exo].id}>
                    <ReactMarkdown>{exercices.data[exo].attributes.contenu}</ReactMarkdown>

                    {isQuestioning &&
                      questions.data.map((question, i) => <Question pid={pid} question={question} i={i} />)}
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
  );
};

export default Exercice;
