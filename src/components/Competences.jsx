import React, { useEffect, useState } from "react";
import * as apiFetch from "../api/fetch.js";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

export const Competences = ({id, niveau}) => {
  const {
    isSuccess: isSuccessCompetence,
    data: competence,
  } = useQuery("competence" + id, () => fetch(`http://strapi.eva-svt.ovh/api/competences/${id}?populate=*`).then((res) => res.json()));
console.log(competence);
  return (
    <>    
    {isSuccessCompetence ? <div className="box">
      {competence.attributes.Nom}
    </div> : "Pas de compétences"}</>


  );
};
