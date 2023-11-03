import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiPost from "../api/post.js";
import { useSearchParams } from "react-router-dom";

export const Question = ({ question }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid");

  const queryClient = useQueryClient();

  const { data: completion } = useQuery(
    "completions",
    () =>
      fetch(
        `http://localhost:1337/api/completions?populate=*&filters[progression]=${pid}&filters[question]=${question.id}`
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
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["completions"]);
      },
    }
  );

  const { mutate: hasAnswer } = useMutation(
    async ({ rid, score }) => {
      return apiPost.updateCompletion(
        {
          reponse: {
            id: rid,
          },
          points: score,
        },
        completion.data[0].id
      );
    },
    {
      onSuccess: (completion) => {
        queryClient.invalidateQueries(["completions"]);
      },
    }
  );

  return (
    <>
      <div className=" box has-text-weight-semibold">
        Question : [{question.attributes.type}] - Niveau {question.attributes.niveau} - {question.attributes.contenu} -
        [{completion && completion.data[0].id}]
      </div>
      <div className="buttons is-flex is-flex-wrap-wrap">
        {question.attributes.reponses.data.map((reponse, i) => {
          return (
            <button
              key={"reponse" + i}
              className={`button is-primary is-info is-flex-basis50 reponse is-size-4 m-3 ${
                completion && completion.data[0].attributes.reponse.data?.id == reponse.id ? "is-selected" : ""
              }  `}
              onClick={() =>
                hasAnswer({ rid: reponse.id, score: reponse.attributes.correct ? question.attributes.score : 0 })
              }
            >
              {reponse.attributes.type} {reponse.attributes.contenu}
            </button>
          );
        })}
      </div>
    </>
  );
};
