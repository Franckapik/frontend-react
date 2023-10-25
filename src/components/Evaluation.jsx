import moment from "moment";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Evaluation = () => {
  let { classeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid")
  const navigate = useNavigate()



  const queryClient = useQueryClient()

  const { isLoading, error, data: evaluations, isSuccess } = useQuery('evaluations', () =>
    fetch(`http://localhost:1337/api/evaluations?populate=*&filters[classe]=${classeId}`).then(res =>
      res.json()
    )
  )


  const { isLoading: isUpdating,  mutate } = useMutation(async (evaId) => {
    console.log(evaId);
    return apiPost.updateProgression({
      evaluation: {
        id: evaId
      }
    }, pid)
  }, {
    onSuccess: (data) => {
     console.log(data);
      queryClient.invalidateQueries(['progression'])
      navigate(`${data.data.attributes.evaluation.data.id}/exercice?pid=${pid}&exo=1`, { replace: true })

    }
  })


  return (
    <div className="">
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Evaluations: </p>
        </div>
        <div>
          {isSuccess?
            <div>
              {evaluations.data.map((eva) => (

                <div key={"eva"+eva.id} onClick={()=>mutate(eva.id)} className="card">{eva.attributes.Nom}</div>
              ))}
            </div> : "Pas d'evaluation pour cette classe"}

        </div>
      </div>
    </div>
  );
};

export default Evaluation;
