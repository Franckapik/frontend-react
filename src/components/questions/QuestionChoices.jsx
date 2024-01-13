import { useEvaParams } from "../../hooks/useEvaParams";

export const QuestionChoice = ({ question, completion, hasAnswer }) => {
  const { correction, papier } = useEvaParams();
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
          correction === null &&
          hasAnswer.mutate({
            cid: completion.id,
            type: question.attributes.type,
            rid: reponse.id,
            isSelected: isSelected,
            points: reponse.attributes.correct ? question.attributes.score : 0,
            comp: question.attributes.competence.data.id,
            niveau: reponse.attributes.correct ? 4 : 1,
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
