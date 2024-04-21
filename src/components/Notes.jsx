import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "moment/dist/locale/fr";
import { getClasses, getProgressionByClasse, getProgressionByEleve } from "../api/fetch";
moment().locale("fr");

export const Notes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cid, setClasseId] = useState();

  const DisplayNote = ({ eid }) => {
    const {
      isSuccess,
      data: progression,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["progression" + eid],
      queryFn: () => getProgressionByEleve(eid),
      enabled: !!eid,
    });

    return <div></div>;
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
           { isSuccessClasse &&    <select
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
          </select>}
      {cid && (
        <div>
          <table className="table">
            {isSuccessClasse && classes?.data
                .filter((a) => a.id == cid)[0]
                .attributes.eleve.data.map((eleve) => (
                  <tr className="row" key={"eleve" + eleve.id} value={eleve.id}>
                    <td>{eleve.id}</td>
                    <td>{eleve.attributes.Nom}</td>
                    <td>{eleve.attributes.Sexe}</td>
                    <td>{eleve.attributes.Naissance}</td>
                    {/*   <td><DisplayNote eid={eleve.id} /></td> */}
                  </tr>
                ))}
          </table>
        </div>
      )}
    </div>
  );
};
