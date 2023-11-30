import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Dashboard = () => {
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
    fetch(`https://strapi.eva-svt.ovh/api/evaluations?populate=*&filters[classes]=${cid}`).then((res) => res.json())
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
        navigate(`/evaluation?pid=${pid}&cid=${cid}&uid=${uid}&eid=${data.data.attributes.evaluation.data.id}&exo=0`);
      },
    }
  );

  return (
    <div>
      <div>
        {isSuccess && (
          <div>
            {evaluations.data?.length > 0 ? (
              <div>
                {evaluations.data?.map((eva, i) => (
                  <div key={"eva" + eva.id} onClick={() => mutate(eva.id)} className="box box_eva has-text-centered">
                   <p className="is-size-4  is-underlined p-4">Evaluation n° {i+1}</p>
                   <p className="is-size-5 ">{eva.attributes.Nom}</p>
                   <button className="button is-size-5 mt-5">Commencer</button>
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

export default Dashboard;
