import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getEva } from "../api/fetch.js";
import { setNote } from "../api/post.js";
import { useEvaParams } from "../hooks/useEvaParams.js";
import { BreadCrumbExo } from "./BreadCrumbExo.jsx";
import { Exo } from "./Exo.jsx";
import { Print } from "./Print.jsx";

const Evaluation = () => {
  const { exo, eid, papier } = useEvaParams();

  const {
    data: exercices,
    isSuccess,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exercices"],
    queryFn: () => getEva(eid),
    enabled: !!eid,
  });

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
              <Exo key={"exo" + i} exercice={exercice} />
            ))}
          {exo && <BreadCrumbExo exo={exo} exoMax={exercices.data.length} />}
        </div>
      </div>
    );
};

export default Evaluation;
