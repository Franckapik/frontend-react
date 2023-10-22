import React, { useEffect, useState } from "react";
import * as apiFetch from "../api/fetch.js";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

export const Progression = () => {
  const [progression, setProgression] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid") || sessionStorage.getItem("sessionPid")

  useEffect(() => {
    const fetchData = async () => {
      const progression = await apiFetch.fetchProgressionByid(pid);
      if (progression.data[0]) {
        setProgression(progression.data[0].attributes);
      }
    };
    fetchData();
  }, [])


  return (
    <>    
    {progression ? <div>
      <p>Creation :{moment(progression.createdAt).format("HH:mm:ss")}
      </p>
      <p>Progression n° : {pid}</p>
      <p>Eleve : {progression.eleve.data ? progression.eleve.data.attributes.Nom : "Pas de nom"}  </p>
      <p>Evaluation : {progression.evaluation.data ? progression.evaluation.data.attributes.Nom : "Pas d'evaluation"}</p>
      <p>Reprise : {progression.reprise}</p>
    </div> : "Pas de progresssion"}</>


  );
};
