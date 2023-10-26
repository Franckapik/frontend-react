import React from "react";
import ReactMarkdown from "react-markdown";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";


const Exercice = () => {
  let { evaId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const pid = searchParams.get("pid");
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

/*   const { data: completion } = useQuery("completions", () =>
    fetch(`http://localhost:1337/api/completion?populate=*&filters[progression]=${pid}`).then((res) => res.json())
  ); */

  const { isLoading: isUpdating, mutate: hasAnswer } = useMutation(
    async ([qid, rid]) => {
      console.log(qid, rid, pid);
      return apiPost.postCompletion(
        {
          progression: {
            id: pid,
          },
          question: {
            id: qid,
          },
          reponse: {
            id: rid,
          },
        },
        pid
      );
    },
    {
      onSuccess: (evaId) => {
        queryClient.invalidateQueries(["completions"]);
      },
    }
  );

  //useEffect for create completion id and then update?

  return (
    <div>
      <div>
        <nav className="breadcrumb has-arrow-separator m-2" aria-label="breadcrumbs">
          <ul>
            <li>
              <a href="#">Evaluation</a>
            </li>
            <li>
              <a href="#">Exercice 1 </a>
            </li>
            <li className="is-active">
              <a href="#" aria-current="page">
                Exercice 2
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="is-size-4">
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

                    {isQuestioning && questions.data.map((question, i) => {
                      return (
                        <>
                          <div className=" box has-text-weight-semibold" key={"question" + i}>
                            Question {i + 1} - [{question.attributes.type}] - Niveau {question.attributes.niveau} -{" "}
                            {question.attributes.contenu}
                          </div>
                          <div className="buttons is-flex is-flex-wrap-wrap">
                            {question.attributes.reponses.data.map((reponse, i) => {
                              return (
                                <button
                                  key={"reponse" + i}
                                  className="button is-primary is-info is-flex-basis50 reponse is-size-4 m-3"
                                  onClick={() => hasAnswer([question.id,reponse.id])}
                                >
                                  {reponse.attributes.type} {reponse.attributes.contenu}{" "}
                                  {reponse.attributes.correct ? "Vrai" : "Fausse"}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })}
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
