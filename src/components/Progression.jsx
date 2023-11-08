import moment from "moment";
import "moment/dist/locale/fr";
import React from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
moment().locale("fr");

export const Progression = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = sessionStorage.getItem("sessionPid") || searchParams.get("pid") || 0;
  const correction = searchParams.get("correction");
  const papier = searchParams.get("papier");

  const {
    isLoading,
    error,
    data: progression,
    isSuccess,
  } = useQuery("progression", () =>
    fetch(`http://strapi.eva-svt.ovh/api/progressions?populate=*&filters[id]=${pid}`).then((res) => res.json())
  );

  return (
    <>
      {isSuccess && progression.data.length ? (
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
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>
                  NOM/PRENOM :{" "}
                  {papier === null &&
                    progression.data[0]?.attributes.eleve?.data != null &&
                    progression.data[0].attributes.eleve.data.attributes.Nom}
                </th>
                <th>
                  CLASSE :{" "}
                  {papier === null &&
                    progression.data[0]?.attributes.classe?.data != null &&
                    progression.data[0].attributes.classe.data.attributes.Classe}{" "}
                </th>
                <th> 
                  {papier === null && correction !== null ?  "NOTE : " : ""}
                 
                  {papier === null && correction !== null &&
                    progression.data[0]?.attributes.points + " / " +  progression.data[0]?.attributes.evaluation.data?.attributes.score }
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan="3"
                  className={`is-size-4 has-text-centered ${
                    correction !== null ? "has-background-primary" : papier !== null ? "" : "has-background-info"
                  }`}
                >
                  {correction !== null ? "Correction : " : "Evaluation : "}
                  {progression.data[0].attributes.evaluation?.data
                    ? progression.data[0].attributes.evaluation.data.attributes.Nom
                    : "Pas d'evaluation"}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        "Pas de progresssion"
      )}
    </>
  );
};
