import React, { useEffect, useState } from "react";
import * as apiFetch from "../api/fetch.js";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

export const Competences = () => {
  const [competences, setCompetences] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid") || sessionStorage.getItem("sessionPid")

  useEffect(() => {
    const fetchData = async () => {
      const competences = await apiFetch.fetchAllCompetences();
      console.log(competences);
      if (competences.data[0]) {
        setCompetences(competences.data);
      }
    };
    fetchData();
  }, [])


  return (
    <>    
    {competences ? <div>
      Competences
      {competences.map((competence) => (
        <li>{competence.attributes.Nom}</li>
      ))}
    </div> : "Pas de compétences"}</>


  );
};
