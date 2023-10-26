import React, { useEffect, useState } from "react";
import * as apiFetch from "../api/fetch.js";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import 'moment/dist/locale/fr'
moment().locale('fr')

export const Progression = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = sessionStorage.getItem("sessionPid") || searchParams.get("pid") || 0

  const { isLoading, error, data: progression, isSuccess } = useQuery('progression', () =>
    fetch(`http://localhost:1337/api/progressions?populate=*&filters[id]=${pid}`, { enabled: !!pid }).then(res =>
      res.json()
    )
  )

  return (
    <>
      {isSuccess ? <><div className="is-flex is-justify-content-space-around p-2 footer-absolute ">
        <div><span className="icon">
          <i className="fa-solid fa-flag-checkered"></i>
        </span> {progression.data[0] != null && moment(progression.data[0].attributes.createdAt).format('LLLL')}</div>
        <div><span className="icon">
          <i className="fa-solid fa-school"></i>
        </span> Progression n° : {pid}</div>
        <div><span className="icon">
          <i className="fa-solid fa-clock"></i>
        </span>Reprise : {progression.data[0] != null && moment(progression.data[0].attributes.reprise).format('LLLL') }</div>
      </div>
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>NOM PRENOM</th>
              <th>CLASSE</th>
              <th>NOTE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{progression.data[0].attributes.eleve.data ? progression.data[0].attributes.eleve.data.attributes.Nom : "Pas de nom"}</td>
              <td>{progression.data[0].attributes.classe.data ? progression.data[0].attributes.classe.data.attributes.Classe : "Pas de classe"}</td>
              <td>/20</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td  colSpan="3" className="is-size-4 has-text-centered has-background-info">Evaluation : {progression.data[0].attributes.evaluation.data ? progression.data[0].attributes.evaluation.data.attributes.Nom : "Pas d'evaluation"} </td>

            </tr>
          </tbody>

        </table></>

        : "Pas de progresssion"}




    </>
  );
};
