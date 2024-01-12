import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getEva } from "../api/fetch.js";
import { setPoints } from "../api/post.js";
import { useEvaParams } from "../hooks/useEvaParams.js";
import { BreadCrumbExo } from "./BreadCrumbExo.jsx";
import { Exo } from "./Exo.jsx";
import { Print } from "./Print.jsx";

const Evaluation = () => {
  const queryClient = useQueryClient();
  const {pid, exo, eid, papier, correction} = useEvaParams();

  const [pointsEva, setPointsEva] = useState({});

  const { data: exercices, isSuccess, isLoading, error } = useQuery({
    queryKey: ["exercices"],
    queryFn: () => getEva(eid),
    enabled: !!eid,
  });


  const changeNote = useMutation({
    mutationFn: (data) => setPoints(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["progression"]);
    },
  });

  useEffect(() => {
    if (correction === null) {
      console.log(pointsEva);
      const note = Object.values(pointsEva).reduce((acc, val) => (acc += val), 0);
      console.log("note totale eva", note);
      changeNote.mutate({ pid: pid, note: note });
    }
  }, [pointsEva, correction]);

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <div>
        {papier !== null && <Print />}
        <div className={papier !== null ? `is-size-6` : `has-text-centered is-size-4`}>
          {exercices.data
            .filter((a, i) => (exo !== null ? i == exo : true))
            .map((exercice, i) => (
              <Exo key={"exo" + i} exercice={exercice} setPointsEva={setPointsEva} />
            ))}
          {exo && <BreadCrumbExo exo={exo} exoMax={exercices.data.length}/>}
        </div>
      </div>
    );
};

export default Evaluation;
