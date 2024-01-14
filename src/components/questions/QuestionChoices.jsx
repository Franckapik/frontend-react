import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProgression } from "../../api/fetch";
import { useEvaParams } from "../../hooks/useEvaParams";
import { setNote } from "../../api/post";

export const QuestionChoice = ({ question, completion, changeCompletion, exid }) => {
  const { correction, papier, pid } = useEvaParams();
  const queryClient = useQueryClient();

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

  return question.attributes.reponses.data.map((reponse, i) => {
    let isSelected = completion.attributes.reponses.data?.map((a) => a.id).includes(reponse.id);
    return (
      <div
        key={"reponse" + i}
        className={
          papier !== null
            ? `p-1`
            : `button is-primary is-info is-flex-basis50 reponse has-text-weight-bold is-size-5 m-3 ${
                isSelected ? "is-selected" : ""
              } ${correction !== null && reponse.attributes.correct ? "is-correct" : ""} `
        }
        onClick={() =>
          handleNote({
            points: { [question.id]: reponse.attributes.correct ? question.attributes.score : 0 },
            completion: {
              cid: completion.id,
              type: question.attributes.type,
              rid: reponse.id,
              isSelected: isSelected,
              points: reponse.attributes.correct ? question.attributes.score : 0,
              comp: question.attributes.competence.data.id,
              niveau: reponse.attributes.correct ? 4 : 1,
            },
          })
        }
      >
        {papier !== null
          ? correction !== null
            ? completion.attributes.reponse.data?.id == reponse.id
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
  });
};
