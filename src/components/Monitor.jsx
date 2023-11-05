import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import "moment/dist/locale/fr";
moment().locale("fr");

const MonitComp = ({ id, table, att }) => {
  const { isSuccess: isSuccess, data } = useQuery(table + id, () =>
    fetch(`http://localhost:1337/api/${table}/${id}?populate=*`).then((res) => res.json())
  );
  return <>{isSuccess && data && <div className="box">{data.data?.attributes[att]}</div>}</>;
};

export const Monitor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [time, setTime] = useState(0);

  const {
    isLoading,
    error,
    data: progressions,
  } = useQuery("progressions", () =>
    fetch("http://localhost:1337/api/progressions?populate=*").then((res) => res.json())
  );

  const {
    data: completions,
  } = useQuery("completions", () =>
    fetch("http://localhost:1337/api/completions?populate=deep").then((res) => res.json())
  );

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
                  <td>{a.attributes.completions.data?.length}{/* : {a.attributes.completions.data?.map(a => ' [' + a.id + '] ' )} */} </td>
                  <td>
                    {" "}
                    {a.attributes.points} pt(s)
                  </td>
                  <td>{moment(a.attributes.creation).fromNow()}</td>
                  <td>
                    {" "}
                    <span className="icon">
                      <i className="fa-solid fa-round"></i>
                    </span>{" "}
                    {moment(a.attributes.updatedAt).fromNow()}
                  </td>
                  <td>
                    {a.attributes.evaluation.data?.id? 
                    <a target="_blank" href= {`/exercice?pid=${a.id}&cid=${a.attributes.classe.data.id}&uid=${a.attributes.eleve.data?.id}&eid=${a.attributes.evaluation.data?.id}&correction`}>
                      Correction
                    </a> : "Pas d'évaluation"}
                  
                  </td>
                </tr>
              </tbody>
            ))}

            
      </table>

        {completions &&
          completions.data
            .filter((a) => a.attributes.progression.data?.id === 200)
            .map((a, i) => (
 <li>{a.id}</li>
            ))}
    </div>
  );
};
