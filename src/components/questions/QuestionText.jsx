import { useRef } from "react";
import { useEvaParams } from "../../hooks/useEvaParams";

export  const QuestionText = ({completion, hasAnswer, question}) => {
    const { correction } = useEvaParams();
    const textareaRef = useRef(null);
    return (
      <>
      <textarea
        id={"textaera" + question.attributes.id}
        rows="5"
        className={`textarea ${completion.data[0]?.attributes.contenu ? "textarea-active" : ""}`}
        placeholder="Entre ta réponse ici ..."
        ref={textareaRef}
      >
        {completion && completion.data[0] && completion.data[0]?.attributes.contenu}
      </textarea>
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
    )
  }