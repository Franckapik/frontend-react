import moment from "moment";
import "moment/dist/locale/fr";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "./BreadCrumb";
import { getProgression } from "../api/fetch";
import { useEvaParams } from "../hooks/useEvaParams";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
moment().locale("fr");

export const Progression = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = sessionStorage.getItem("sessionPid") || searchParams.get("pid") || 0;
  const { exo, eid, papier, correction } = useEvaParams();
  const [avatar, setAvatar] = useState(false);

  const {
    isLoading,
    error,
    data: progression,
    isSuccess,
  } = useQuery({
    queryKey: ["progression"],
    queryFn: () => getProgression(pid),
    enabled: !!pid,
  });

  useEffect(() => {
    if (progression?.data[0]) {
      const avatar = createAvatar(adventurerNeutral, {
        seed: progression.data[0].attributes.eleve.data?.attributes.Nom,
        size: 64,
        radius: 50
      });
      const svg = avatar.toDataUriSync();
      setAvatar(svg);
    }
  }, [isSuccess]);

  

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <div>
        <>
          {papier === null && (
            <div className="is-flex is-justify-content-space-around p-2 footer-absolute ">
              <div>
                <span className="icon">
                  <i className="fa-solid fa-flag-checkered"></i>
                </span>{" "}
                {progression.data[0] != null && moment(progression.data[0].attributes.createdAt).format("LLLL")}
              </div>
              <div>
                <span className="icon">
                  <i className="fa-solid fa-school"></i>
                </span>{" "}
                Progression n° : {pid}
              </div>
              <div>
                <span className="icon">
                  <i className="fa-solid fa-clock"></i>
                </span>
                Reprise : {progression.data[0] != null && moment(progression.data[0].attributes.reprise).format("LLLL")}
              </div>
            </div>
          )}
          <table className="table is-striped is-fullwidth position-fixed">
            <thead>
              <tr>
                <th>
                  <i className="fa-regular fa-id-badge"></i>  {avatar && <img src={avatar} />} NOM/PRENOM :{" "}
                  {papier === null && progression.data[0]?.attributes.eleve?.data != null && (
                    <div className="tag is-medium ">{progression.data[0].attributes.eleve.data.attributes.Nom} </div>
                  )}
                </th>
                <th>
                  <i className="fa-solid fa-people-roof"></i>
                 CLASSE :{" "}
                  {papier === null && progression.data[0]?.attributes.classe?.data != null && (
                    <div className="tag is-medium"> {progression.data[0].attributes.classe.data.attributes.Classe}</div>
                  )}{" "}
                </th>
                <th>
                  {papier === null && correction !== null ? "NOTE : " : ""}

                  {papier === null &&
                    correction !== null &&
                    progression.data[0]?.attributes.points +
                      " / " +
                      progression.data[0]?.attributes.evaluation.data?.attributes.score}
                </th>
              </tr>
            </thead>
            {eid && progression.data[0].attributes.evaluation?.data && (
              <tbody>
                <tr>
                  <td
                    colSpan="3"
                    className={`is-size-4 has-text-centered  ${
                      correction !== null
                        ? "has-background-primary"
                        : papier !== null
                        ? ""
                        : "has-background-info-light"
                    }`}
                  >
                    <i className="fa-solid fa-clipboard-question "></i>{" "}
                    <span className="ml-4">{progression.data[0].attributes.evaluation.data.attributes.Nom}</span>{" "}
                  </td>
                </tr>
              </tbody>
            )}
            <tbody>
              <tr>
                <td colSpan="3">{exo && <Breadcrumb />}</td>
              </tr>
            </tbody>
          </table>
        </>
      </div>
    );
};
