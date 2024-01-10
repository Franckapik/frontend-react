import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";
import { getEvaluations } from "../api/fetch.js";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const cid = searchParams.get("cid");
  const uid = searchParams.get("uid");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: evaluations,
    isSuccess,
  } = useQuery({ queryKey: ["evaluations"], queryFn: () => getEvaluations(cid), enabled: !!cid });

  const startEvaluation = useMutation({
    mutationFn: (data) => apiPost.setEvaId(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["progression"]);
      navigate(`/evaluation?pid=${pid}&cid=${cid}&uid=${uid}&eid=${data.attributes.evaluation.data.id}&exo=0`);
    },
  });

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <div>
        {evaluations.data?.length > 0 ? (
          <div>
            {evaluations.data?.map((eva, i) => (
              <div
                key={"eva" + eva.id}
                onClick={() => startEvaluation.mutate({ evaId: eva.id, pid: pid })}
                className="box box_eva has-text-centered"
              >
                <p className="is-size-4  is-underlined p-4">Evaluation n° {i + 1}</p>
                <p className="is-size-5 ">{eva.attributes.Nom}</p>
                <button className="button is-size-5 mt-5">Commencer</button>
              </div>
            ))}
          </div>
        ) : (
          "Aucune évaluation pour cette classe"
        )}
      </div>
    );
};

export default Dashboard;
