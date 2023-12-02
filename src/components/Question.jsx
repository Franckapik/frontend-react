import React, { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiPost from "../api/post.js";
import { useSearchParams } from "react-router-dom";
import { Competences } from "./Competences.jsx";

export const Question = ({ question, exo, index }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const correction = searchParams.get("correction");
  const papier = searchParams.get("papier");
  const textareaRef = useRef(null)

  const queryClient = useQueryClient();

  const { isSuccess: isSuccessCompletion, data: completion } = useQuery(
    "completions" + "E" + exo.id + "Q" + index,
    () =>
      fetch(
        `https://strapi.eva-svt.ovh/api/completions?populate[0]=reponses&filters[progression]=${pid}&filters[question]=${question.id}`
      ).then((res) => res.json()),
    {
      onSuccess: (completion) => {
        if (completion.data.length == 0) {
          createCompletion();
        }
      },
    }
  );

  const { mutate: createCompletion } = useMutation(
    async () => {
      return apiPost.postCompletion({
        progression: {
          id: pid,
        },
        question: {
          id: question.id,
        },
        exercice: {
          id: question.attributes.exercice.data.id,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["completions" + index]);
      },
    }
  );

  const { mutate: hasAnswer } = useMutation(
    async ({ texte, type, rid, isSelected, score, comp, niveau }) => {
      if (type === "choix multiple") {
        switch (true) {
          case isSelected === false || isSelected == 0:
            return apiPost.updateCompletion(
              {
                reponses: {
                  connect: [rid],
                },
                points: score,
                validation: [
                  {
                    competence: comp,
                    niveau: niveau,
                  },
                ],
              },
              completion.data[0].id
            );
            break;

          case isSelected === true:
            return apiPost.updateCompletion(
              {
                reponses: {
                  disconnect: [rid],
                },
                points: score,
                validation: [
                  {
                    competence: comp,
                    niveau: niveau,
                  },
                ],
              },
              completion.data[0].id
            );
            break;

          default:
            break;
        }
      } else if (type === "choix simple") {
        return apiPost.updateCompletion(
          {
            reponses: {
              set: [rid] /* disconnect, connect, set*/,
            },
            points: score,
            validation: [
              {
                competence: comp,
                niveau: niveau,
              },
            ],
          },
          completion.data[0].id
        );
      } else if (type === "texte") {
        console.log(texte);
        return apiPost.updateCompletion(
          {
            contenu: texte,
            points: score,
            validation: [
              {
                competence: comp,
                niveau: niveau,
              },
            ],
          },
          completion.data[0].id
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["completions" + "E" + exo.id + "Q" + index]);
      },
    }
  );

  /*   console.table(completion.data[0].attributes.reponses.data);
   */
  return (
    <>
      {isSuccessCompletion && completion.data.length && (
        <>
          <div
            className={
              papier !== null
                ? `has-text-weight-semibold mt-3 mb-3 is-flex is-justify-content-space-between`
                : `box has-text-weight-semibold`
            }
          >
            {papier !== null ? "► " : ""} Q{index}{" "}
            {/* [ niveau 
             {question.attributes.niveau} ] */}{" "}
            : {question.attributes.contenu} ({question.attributes.type})
            {correction !== null && completion.data[0]?.attributes.points} / {question.attributes.score}
            <div className="is-size-7 mr-5">
              Compétence :{" "}
              {correction !== null && completion.data[0]?.attributes.validation.length
                ? completion.data[0]?.attributes.validation[0]?.competence.data?.attributes.Nom +
                  ":" +
                  completion.data[0]?.attributes.validation[0]?.niveau
                : question.attributes.competence.data?.attributes.Nom}
            </div>
          </div>
          <div className={papier !== null ? `ml-5` : `is-flex is-flex-wrap-wrap`}>
            {(question.attributes.type === "choix simple" || question.attributes.type === "choix multiple") &&
              question.attributes.reponses.data.map((reponse, i) => {
                let isSelected =
                  completion &&
                  completion.data[0] &&
                  completion.data[0].attributes.reponses &&
                  completion.data[0].attributes.reponses.data.length &&
                  completion.data[0].attributes.reponses.data.map((a) => a.id).includes(reponse.id);
                return (
                  <div
                    key={"reponse" + i}
                    className={
                      papier !== null
                        ? `p-1`
                        : `button is-primary is-info is-flex-basis50 reponse is-size-5 m-3 ${
                            isSelected ? "is-selected" : ""
                          } ${correction !== null && reponse.attributes.correct ? "is-correct" : ""} `
                    }
                    onClick={() =>
                      correction === null &&
                      hasAnswer({
                        type: question.attributes.type,
                        rid: reponse.id,
                        isSelected: isSelected,
                        score: reponse.attributes.correct ? question.attributes.score : 0,
                        comp: question.attributes.competence.data.id,
                        niveau: reponse.attributes.correct ? 4 : 1,
                      })
                    }
                  >
                    {papier !== null
                      ? correction !== null
                        ? completion.data[0].attributes.reponse.data?.id == reponse.id
                          ? reponse.attributes.correct
                            ? "🗹"
                            : "𐄂"
                          : reponse.attributes.correct
                          ? "→"
                          : "□"
                        : "□"
                      : ""}
                    {reponse.attributes.type} {reponse.attributes.contenu}
                  </div>
                );
              })}

            {question.attributes.type === "texte" && (
              <>
                <textarea
                  id={"textaera" + question.attributes.id}
                  rows="5"
                  className="textarea"
                  placeholder="Entre ta réponse ici ..."
                  ref={textareaRef}
                ></textarea>
                <button
                  onClick={() =>
                    correction === null &&
                    hasAnswer({
                      texte: textareaRef.current.value,
                      type: question.attributes.type,
                      score: question.attributes.score,
                      comp: question.attributes.competence.data.id,
                      niveau: 4,
                    })
                  }
                  className="button mt-2"
                >
                  Valider ma réponse
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
/* 
{`button is-primary is-info is-flex-basis50 reponse is-size-4 m-3 ${
  completion && completion.data[0].attributes.reponse.data?.id == reponse.id ? "is-selected" : ""
} ${
  correction !== null && reponse.attributes.correct ? "is-correct" : ""
} `} */
