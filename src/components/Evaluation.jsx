import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Evaluation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid")
  const cid = searchParams.get("cid")
  const uid = searchParams.get("uid")
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: evaluations,
    isSuccess,
  } = useQuery("evaluations", () =>
    fetch(`http://localhost:1337/api/evaluations?populate=*&filters[classe]=${cid}`).then((res) => res.json())
  );

  const { isLoading: isUpdating, mutate } = useMutation(
    async (evaId) => {
      return apiPost.updateProgression(
        {
          evaluation: {
            id: evaId,
          },
        },
        pid
      );
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["progression"]);
        navigate(`/exercice?pid=${pid}&cid=${cid}&uid=${uid}&eid=${data.data.attributes.evaluation.data.id}&exo=0`);
      },
    }
  );

  return (
    <div>
      <div>
        {isSuccess && (
          <div>
            {evaluations.data.length > 0 ? (
              <div>
                {evaluations.data.map((eva, i) => (
                  <div key={"eva" + eva.id} onClick={() => mutate(eva.id)} className="box ">
                   Evaluation n° {i+1} - {eva.attributes.Nom}
                  </div>
                ))}
              </div>
            ) : (
              "Aucune évaluation pour cette classe"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
