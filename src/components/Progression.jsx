import moment from "moment";
import "moment/dist/locale/fr";
import React from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb } from "./BreadCrumb";
moment().locale("fr");

export const Progression = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = sessionStorage.getItem("sessionPid") || searchParams.get("pid") || 0;
  const correction = searchParams.get("correction");
  const papier = searchParams.get("papier");
  const eid = searchParams.get("eid");
  const exo = searchParams.get("exo");

  const {
    isLoading,
    error,
    data: progression,
    isSuccess,
  } = useQuery("progression", () =>
    fetch(`https://strapi.eva-svt.ovh/api/progressions?populate=*&filters[id]=${pid}`).then((res) => res.json())
  );

  return (
    <div>
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
          <table className="table is-striped is-fullwidth position-fixed">
            <thead>
              <tr>
                <th>
                <i className="fa-regular fa-id-badge"></i> NOM/PRENOM :{" "}
                  {papier === null && progression.data[0]?.attributes.eleve?.data != null && (
                    <div className="tag is-medium ">{progression.data[0].attributes.eleve.data.attributes.Nom} </div>
                  )}
                </th>
                <th>
                <i className="fa-solid fa-people-roof"></i> CLASSE :{" "}
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
            {eid && progression.data[0].attributes.evaluation?.data ? (
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
                   <span className="ml-4">{progression.data[0].attributes.evaluation.data.attributes.Nom}
                  </span> </td>
                </tr>
              </tbody>
            ) : (
              ""
            )}
            <tbody>
              <tr>
                <td colSpan="3">{exo && <Breadcrumb />}</td>
              </tr>
            </tbody>
          </table>
          {/*           { exo && 
        <Breadcrumb />
      } */}
        </>
      ) : (
        <div className="has-text-centered box m-2 is-size-4 is-outlined ">
          Bienvenue sur le site d'évaluation des SVT
        </div>
      )}
    </div>
  );
};
