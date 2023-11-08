import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import "moment/dist/locale/fr";
moment().locale("fr");

const MonitComp = ({ id, table, att }) => {
  const { isSuccess: isSuccess, data } = useQuery(table + id, () =>
    fetch(`https://strapi.eva-svt.ovh/api/${table}/${id}?populate=*`).then((res) => res.json())
  );
  return <>{isSuccess && data && <div className="box">{data.data?.attributes[att]}</div>}</>;
};

export const Monitor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [time, setTime] = useState(0);
  const [modal, setModalPid] = useState(0);

  const {
    isLoading,
    error,
    data: progressions,
  } = useQuery("progressions", () =>
    fetch("https://strapi.eva-svt.ovh/api/progressions?populate=*").then((res) => res.json())
  );

  const { data: completions } = useQuery("completions", () =>
    fetch("https://strapi.eva-svt.ovh/api/completions?populate=deep").then((res) => res.json())
  );

  {
    console.log(completions);
  }

  return (
    <div>
      <select
        name="monitor time"
        id="monit-select"
        className="select is-large m-5"
        onChange={(e) => setTime(e.target.value)}
        defaultValue={0}
      >
        <option value={0}>-- Pas de filtre--</option>

        <option value={3600000}>1 heure</option>
        <option value={72000000}>2 heure</option>
      </select>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>PID</th>
            <th>CLASSE</th>
            <th>ELEVE</th>
            <th>EVALUATION</th>
            <th>REPONSES</th>
            <th>POINTS</th>
            <th>CONNECTION</th>
            <th>MAJ</th>
            <th>SESSION</th>
          </tr>
        </thead>
        {progressions &&
          progressions.data
            .filter((a) => (time != 0 ? moment() - moment(a.attributes.creation) <= time : true))
            .map((a, i) => (
              <tbody>
                <tr>
                  <td>{a.id}</td>
                  <td>
                    {a.attributes.classe.data?.attributes.Classe} [CID {a.attributes.classe.data?.id}]{" "}
                  </td>

                  <td>
                    {a.attributes.eleve.data?.attributes.Nom} [UID {a.attributes.eleve.data?.id} ]
                  </td>
                  <td>
                    {a.attributes.evaluation.data?.attributes.Nom} [EID {a.attributes.evaluation.data?.id}]
                  </td>
                  <td >
                    {a.attributes.completions.data?.length}
                    <button className="button" onClick={() => setModalPid(a.id)}>Details</button>
                    {/* : {a.attributes.completions.data?.map(a => ' [' + a.id + '] ' )} */}{" "}
                    
                  </td>
                  <td> {a.attributes.points} pt(s)</td>
                  <td>{moment(a.attributes.creation).fromNow()}</td>
                  <td>
                    {" "}
                    <span className="icon">
                      <i className="fa-solid fa-round"></i>
                    </span>{" "}
                    {moment(a.attributes.updatedAt).fromNow()}
                  </td>
                  <td>
                    {a.attributes.evaluation.data?.id ? (
                      <a
                        target="_blank"
                        href={`/exercice?pid=${a.id}&cid=${a.attributes.classe.data.id}&uid=${a.attributes.eleve.data?.id}&eid=${a.attributes.evaluation.data?.id}&correction`}
                      >
                        Correction
                      </a>
                    ) : (
                      "Pas d'évaluation"
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
      </table>
      <div className={`modal ${modal? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-content has-text-white">
        {completions &&
                      completions.data
                        .filter((c) => c.attributes.progression.data?.id == modal)
                        .map((a, i) => (
                          <li>
                            {" "}
                            {a.attributes.validation[0]?.competence.data?.attributes.Nom} :{" "}
                            {a.attributes.validation[0]?.niveau}{" "}
                          </li>
                        ))}
        </div>
        <button className="modal-close is-large" onClick={() => setModalPid(0)} aria-label="close"></button>
      </div>
    </div>
  );
};
