import { useRef } from "react";
import { useEvaParams } from "../../hooks/useEvaParams";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProgression } from "../../api/fetch";
import { setNote } from "../../api/post";

export const QuestionText = ({ completion, changeCompletion, question }) => {
  const { correction, pid } = useEvaParams();
  const textareaRef = useRef(null);

  const { data: progression, isSuccess: isProgression } = useQuery({
    queryKey: ["progression"],
    queryFn: () => getProgression(pid),
    enabled: !!pid,
  });

  const changeNote = useMutation({
    mutationFn: (data) => setNote(data),
    onSuccess: (note) => {
      queryClient.invalidateQueries(["progression"]);
    },
  });

  const handleNote = ({ points, completion }) => {
    if (correction === null) {
      changeCompletion.mutate(completion);
      const oldPoints = progression?.data[0]?.attributes.note;
      const newPoints = { [exid]: { ...oldPoints[exid], ...points } };
      const newNote = { ...oldPoints, ...newPoints };
      const total = Object.values(newNote).reduce((acc, val) => {
        Object.values(val).forEach((e) => {
          acc += e;
        });
        return acc;
      }, 0);
      changeNote.mutate({ note: newNote, points: total, pid: pid });
    }
  };

  return (
    <>
      <textarea
        spellCheck={true}
        id={"textaera" + question.attributes.id}
        rows="5"
        className={`textarea ${completion.attributes.contenu ? "textarea-active" : ""}`}
        placeholder="Entre ta réponse ici ..."
        ref={textareaRef}
      >
        {completion && completion.attributes.contenu}
      </textarea>
      <button
      onClick={() =>
        handleNote({
          points: { [question.id]: reponse.attributes.correct ? question.attributes.score : 0 },
          completion: {
            texte: textareaRef.current.value,
            type: question.attributes.type,
            points: question.attributes.score,
            comp: question.attributes.competence.data.id,
            cid : completion.id,
            niveau: 4,
          },
        })
      }
        className="button mt-2"
      >
        Valider ma réponse
      </button>
    </>
  );
};
