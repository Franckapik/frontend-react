import { useRef } from "react";
import { useEvaParams } from "../../hooks/useEvaParams";

export const QuestionText = ({ completion, hasAnswer, question }) => {
  const { correction } = useEvaParams();
  const textareaRef = useRef(null);
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
          correction === null &&
          hasAnswer.mutate({
            texte: textareaRef.current.value,
            type: question.attributes.type,
            points: question.attributes.score,
            comp: question.attributes.competence.data.id,
            cid : completion.id,
            niveau: 4,
          })
        }
        className="button mt-2"
      >
        Valider ma réponse
      </button>
    </>
  );
};
