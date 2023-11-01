import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";
import { Question } from "./Question.jsx";

const Exercice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const pid = searchParams.get("pid");
  const cid = searchParams.get("cid");
  const eid = searchParams.get("eid");
  const uid = searchParams.get("uid");

  const [listCoid, setListCoid] = useState({});
  const navigate = useNavigate();

  const queryClient = useQueryClient();

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

  //useEffect for create completion id and then update?

  return (
    <div>
      <div>
        <nav className="breadcrumb has-arrow-separator m-2" aria-label="breadcrumbs">
          <ul>
            <li>
              <a href={`/evaluation?pid=${pid}&cid=${cid}&uid=${uid}&eid=${eid}`} className="p-2">
                Evaluation
              </a>
            </li>

            {isSuccess &&
              exercices.data.map((exercice, i) => {
                return (
                  <li key={"breadcrumb_exo" + i} className={i === Number(exo) ? "is-active" : ""}>
                    <span
                      className="p-2 cursor"
                      onClick={() =>
                        setSearchParams((searchParams) => {
                          searchParams.set("exo", i);
                          return searchParams;
                        })
                      }
                    >
                      Exercice {exercice.attributes.numero}{" "}
                    </span>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
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
                      questions.data.map((question, i) => (
                        <Question pid={pid} question={question} i={i} />
                      ))}
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
