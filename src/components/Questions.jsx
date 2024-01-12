import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getCompletionByQID } from "../api/fetch.js";
import { setCompletion, setCompletionResponse } from "../api/post.js";
import { useEvaParams } from "../hooks/useEvaParams.js";
import { QuestionChoice } from "./questions/QuestionChoices.jsx";
import { QuestionText } from "./questions/QuestionText.jsx";

export const Questions = ({ question, exid, index }) => {
  const { pid, correction, papier } = useEvaParams();
  const queryClient = useQueryClient();
  const [isCompletion, setIsCompletion] = useState(false)

  /* Check if existing completion */
  const {
    isSuccess,
    data: completion,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["completions" + "Exo" + exid + "Q" + index],
    queryFn: () => getCompletionByQID({ pid: pid, qid: question.id }),
  });

  const createCompletion = useMutation({
    mutationKey: ["createCompletion" + index],
    mutationFn: (data) => setCompletion(data),
    onSuccess: () => {
      setIsCompletion(true)
      queryClient.invalidateQueries(["completions" + "Exo" + exid + "Q" + index]);
    },
  });

  /* Une question non répondue doit être enregistrée dès le début */
  useEffect(() => {
    if(completion === null) {
      createCompletion.mutate({ pid: pid, qid: question.id, eid: question.attributes.exercice.data.id })
    }
  }, [isSuccess])

  const hasAnswer = useMutation({
    mutationKey: ["setCompletionresponse" + index],
    mutationFn: (data) => setCompletionResponse(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["completions" + "Exo" + exid + "Q" + index]);
    },
  });

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess && completion)
    return (
      <>
        {/* Questions title */}
        <div
          className={
            papier !== null
              ? `has-text-weight-semibold mt-3 mb-3 is-flex is-justify-content-space-between`
              : `box has-text-weight-semibold`
          }
        >
          {papier !== null ? "► " : ""} Q{index} : {question.attributes.contenu} ({question.attributes.type})
          {correction !== null && completion.attributes.points} / {question.attributes.score}
          <div className="is-size-7 mr-5">
            Compétence :{" "}
            {correction !== null && completion.attributes.validation.length
              ? completion.attributes.validation[0]?.competence.data?.attributes.Nom +
                ":" +
                completion.attributes.validation[0]?.niveau
              : question.attributes.competence.data?.attributes.Nom}
          </div>
        </div>

        {/* Questions input */}
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
