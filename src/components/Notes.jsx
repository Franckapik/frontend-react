import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "moment/dist/locale/fr";
import { getClasses, getProgressionByClasse, getProgressionByEleve } from "../api/fetch";
moment().locale("fr");
import { useSearchParams } from "react-router-dom";

export const Notes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cid, setClasseId] = useState();
  const [eid, setEvaluationId] = useState();


  const DisplayNote = ({ uid, cid, eid}) => {

    const {
      isSuccess,
      data: progression,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["progression" + uid],
      queryFn: () => getProgressionByEleve(uid),
      enabled: !!uid,
    });

    return (
      <>
        <td>{isSuccess && progression.data.length && progression.data[0].attributes.points}</td>{" "}
        <td>{isSuccess && progression.data.length && progression.data[0].attributes.completions?.data?.length}</td>{" "}
        <td>
          <dfn
            className="cursor"
            title={
              isSuccess &&
              progression.data.length &&
              moment(progression.data[0].attributes.creation).format("LLLL") +
                " - " +
                moment(progression.data[0].attributes.updatedAt).format("LLLL")
            }
          >
            {isSuccess &&
              progression.data.length &&
              moment
                .duration(
                  moment(progression.data[0].attributes.updatedAt).diff(
                    moment(progression.data[0].attributes.createdAt)
                  )
                )
                .asMinutes()
                .toFixed(0) + " minute(s)"}
          </dfn>
        </td>
        <td><div
        className="cursor"
          onClick={() =>
            navigate(
              `/evaluation?&pid=${progression.data[0].id}&cid=${cid}&uid=${uid}&eid=${eid}&correction`
            )
          }
        ><span class="icon">
       <i class="far fa-clipboard"></i>
      </span></div></td>
      </>
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
           <select
          name="evaluations"
          id="evaluations-select"
          className="select is-large m-5 w300"
          onChange={(e) => setEvaluationId(e.target.value)}
          defaultValue={-1}
        >
          <option key={"default select"} value="-1" disabled="disabled">
            -- Evaluations --
          </option>
          {classes.data.filter((classe) => classe.id == cid )[0].attributes.evaluations.data.map((evaluation) => (
            <option key={"evaluation" + evaluation.id} value={evaluation.id}>
              {evaluation.attributes.Nom}
            </option>
          ))}
        </select>
          {eid && <table className="table is-bordered is-fullwidth is-striped is-hoverable">
            <th>UID</th>
            <th>Nom</th>
            <th>Sexe</th>
            <th>Naissance</th>
            <th>Note</th>
            <th>Complétions</th>
            <th>Temps</th>
            {isSuccessClasse &&
              classes?.data
                .filter((a) => a.id == cid)[0]
                .attributes.eleve.data.map((eleve) => (
                  <tr className="row" key={"eleve" + eleve.id} value={eleve.id}>
                    <td>{eleve.id}</td>
                    <td>{eleve.attributes.Nom}</td>
                    <td>{eleve.attributes.Sexe}</td>
                    <td>{eleve.attributes.Naissance}</td>
                    <DisplayNote eid={eid} cid={cid} uid={eleve.id} />
                  </tr>
                ))}
          </table>}
        </div>
      )}
    </div>
  );
};
