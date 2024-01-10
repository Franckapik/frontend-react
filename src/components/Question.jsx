import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getCompletionByQID } from "../api/fetch.js";
import * as apiPost from "../api/post.js";
import { QuestionChoice } from "./questions/QuestionChoices.jsx";
import { QuestionText } from "./questions/QuestionText.jsx";
import { useEvaParams } from "../hooks/useEvaParams.js";

export const Question = ({ question, exid, index }) => {
  const { pid, correction, papier } = useEvaParams();
  const queryClient = useQueryClient();

  const {
    isSuccess,
    data: completion,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["completions" + "E" + exid + "Q" + index],
    queryFn: () => getCompletionByQID(question.id),
    onSuccess: (completion) => {
      if (completion.data.length == 0) {
        createCompletion.mutate();
      }
    },
  });

  const createCompletion = useMutation({
    mutationFn: () => apiPost.setCompletion({ pid: pid, qid: question.id, eid: question.attributes.exercice.data.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["completions" + index]);
    },
  });

  const hasAnswer = useMutation({
    mutationFn: (data) => apiPost.setCompletionResponse(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["completions" + "E" + exid + "Q" + index]);
    },
  });

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <>
        <div
          className={
            papier !== null
              ? `has-text-weight-semibold mt-3 mb-3 is-flex is-justify-content-space-between`
              : `box has-text-weight-semibold`
          }
        >
          {papier !== null ? "► " : ""} Q{index} : {question.attributes.contenu} ({question.attributes.type})
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
          {(question.attributes.type === "choix simple" || question.attributes.type === "choix multiple") && (
            <QuestionChoice question={question} completion={completion} hasAnswer={hasAnswer} />
          )}

          {question.attributes.type === "texte" && (
            <QuestionText question={question} completion={completion} hasAnswer={hasAnswer} />
          )}
        </div>
      </>
    );
};