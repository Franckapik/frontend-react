import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiPost from "../api/post.js";
import { useSearchParams } from "react-router-dom";
import { Competences } from "./Competences.jsx";

export const Question = ({ question, exo, index }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const correction = searchParams.get("correction");
  const papier = searchParams.get("papier");

  const queryClient = useQueryClient();

  const { isSuccess: isSuccessCompletion, data: completion } = useQuery(
    "completions" + "E" + exo.id + "Q" + index,
    () =>
      fetch(
        `http://localhost:1337/api/completions?populate=deep&filters[progression]=${pid}&filters[question]=${question.id}`
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
    async ({ rid, score, comp, niveau }) => {
      return apiPost.updateCompletion(
        {
          reponse: {
            id: rid,
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
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["completions" + "E" + exo.id + "Q" + index]);
      },
    }
  );

  return (
    <>
      {isSuccessCompletion && completion.data.length && (
        <>
          <div className={papier !== null ? `has-text-weight-bold  pb-4` : `box has-text-weight-semibold`}>
            {papier !== null ? "► " : ""} Question {index} : [{question.attributes.type}] - Niveau{" "}
            {question.attributes.niveau} - {question.attributes.contenu}
            {correction !== null && completion.data[0]?.attributes.points} / {question.attributes.score}
            <div>
              {correction !== null && completion.data[0]?.attributes.validation.length
                ? completion.data[0]?.attributes.validation[0]?.competence.data?.attributes.Nom +
                  ":" +
                  completion.data[0]?.attributes.validation[0]?.niveau
                : question.attributes.competence.data?.attributes.Nom}
            </div>
          </div>
          <div className={papier !== null ? `` : `is-flex is-flex-wrap-wrap`}>
            {question.attributes.reponses.data.map((reponse, i) => {
              return (
                <div
                  key={"reponse" + i}
                  className={
                    papier !== null
                      ? `p-1`
                      : `button is-primary is-info is-flex-basis50 reponse is-size-4 m-3 ${
                          completion && completion.data[0].attributes.reponse.data?.id == reponse.id
                            ? "is-selected"
                            : ""
                        } ${correction !== null && reponse.attributes.correct ? "is-correct" : ""} `
                  }
                  onClick={() =>
                    correction === null &&
                    hasAnswer({
                      rid: reponse.id,
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
