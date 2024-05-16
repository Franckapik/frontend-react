import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import "moment/dist/locale/fr";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, getProgressionByClasse, getProgressionByEleve } from "../api/fetch";
moment().locale("fr");

export const Notes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cid, setClasseId] = useState();

  const DisplayNote = ({ uid, eid }) => {
    const {
      isSuccess,
      data: progression,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["progression" + uid + eid],
      queryFn: () => getProgressionByEleve(uid, eid),
      enabled: !!uid && !!eid,
    });

    return (
      <td>
        {isSuccess ? (
          <div
            className={
              Number.isInteger(progression.data[0]?.attributes?.points)
                ? progression.data[0]?.attributes?.points > 8
                  ? progression.data[0]?.attributes?.points > 12
                    ? "is-success tag is-medium"
                    : "tag is-medium is-warning"
                  : "tag is-medium is-danger"
                : "tag is-medium is-info"
            }
          >
            {progression.data[0]
              ? progression.data[0]?.attributes?.points !== null
                ? `${progression.data[0]?.attributes?.points} pts `
                : "?"
              : "𐄂"}
          </div>
        ) : (
          "rien"
        )}
      </td>
    );
  };

  const {
    isSuccess: isSuccessClasse,
    data: classes,
    isLoadingClasse,
    Classe,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getClasses(),
  });

  const {
    isSuccess,
    data: progressions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["progressions"],
    queryFn: () => getProgressionByClasse(cid),
    enabled: !!cid,
  });

  return (
    <div>
      {isSuccessClasse && (
        <select
          name="classes"
          id="classes-select"
          className="select is-large m-5 w300"
          onChange={(e) => setClasseId(e.target.value)}
          defaultValue={-1}
        >
          <option key={"default select"} value="-1" disabled="disabled">
            -- Classes --
          </option>

          {classes?.data.map((classe) => (
            <option key={"classe" + classe.id} value={classe.id}>
              {classe.attributes.Classe}
            </option>
          ))}
        </select>
      )}
      {cid && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">Nom</th>
                <th scope="col">Genre</th>
                <th scope="col">Naissance</th>
                {classes?.data
                      .filter((a) => a.id == cid)[0]
                      .attributes.evaluations.data.map((eva) => (
                        <th scope="col">{eva.attributes.Nom}</th>
                      ))}
               
              </tr>
            </thead>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Nombre eleves</th>
                <th scope="col"></th>
                <th scope="col"></th>
                {classes?.data
                      .filter((a) => a.id == cid)[0]
                      .attributes.evaluations.data.map((eva) => (
                        <th scope="col">Date {eva.attributes.score} pts</th>
                      ))}
               
              </tr>
            </thead>
            {isSuccessClasse &&
              classes?.data
                .filter((a) => a.id == cid)[0]
                .attributes.eleve.data.map((eleve) => (
                  <tr className="row" key={"eleve" + eleve.id} value={eleve.id}>
                    <td className="tag">{eleve.id}</td>
                    <td>{eleve.attributes.Nom}</td>
                    <td>{eleve.attributes.Sexe}</td>
                    <td>{eleve.attributes.Naissance}</td>
                    {classes?.data
                      .filter((a) => a.id == cid)[0]
                      .attributes.evaluations.data.map((eva) => (
                        <DisplayNote uid={eleve.id} eid={eva.id} />
                      ))}
                  </tr>
                ))}
          </table>
        </div>
      )}
    </div>
  );
};
