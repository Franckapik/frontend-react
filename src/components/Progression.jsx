import React, { useEffect, useState } from "react";
import * as apiFetch from "../api/fetch.js";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

export const Progression = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid") || sessionStorage.getItem("sessionPid")

  const { isLoading, error, data: progression, isSuccess } = useQuery('progression', () =>
    fetch(`http://localhost:1337/api/progressions?populate=*&filters[id]=${pid}`, { enabled: !!pid }).then(res =>
      res.json()
    )
  )

  let p = []

  isSuccess ? p = progression?.data[0]?.attributes : []
  return (
    <>
      {isSuccess ? <div>
        <p>Creation :{moment(p.createdAt).format("HH:mm:ss")}</p>
        <p>Classe : {p.classe.data.attributes.Classe}</p>
        <p>Progression n° : {pid}</p>
        <p>Eleve : {p.eleve.data ? p.eleve.data.attributes.Nom : "Pas de nom"}  </p>
        <p>Evaluation : {p.evaluation.data ? p.evaluation.data.attributes.Nom : "Pas d'evaluation"}</p>
        <p>Reprise : {p.reprise}</p>
      </div> : "Pas de progresssion"}</>
  );
};
