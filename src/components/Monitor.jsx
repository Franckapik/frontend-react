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
    data: completions,
  } = useQuery("progressions", () =>
    fetch("http://localhost:1337/api/progressions?populate=*").then((res) => res.json())
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
            <th>ELEVE</th>
            <th>REPONSES</th>
            <th>POINTS</th>
            <th>CONNECTION</th>
            <th>MAJ</th>
          </tr>
        </thead>
        {completions &&
          completions.data
            .filter((a) => (time != 0 ? moment() - moment(a.attributes.creation) <= time : true))
            .map((a, i) => (
              <tbody>
                <tr>
                  {console.log(moment() - moment(a.attributes.creation))}

                  <td>{a.id}</td>
                  <td>{a.attributes.eleve.data?.attributes.Nom}</td>
                  <td>{a.attributes.completions.data?.length}</td>
                  <td>
                    {" "}
                    {a.attributes.completions.data?.reduce((acc, prev) => (acc += prev.attributes?.points), 0)} pts
                  </td>
                  <td>{moment(a.attributes.creation).fromNow()}</td>
                  <td>
                    {" "}
                    <span className="icon">
                      <i className="fa-solid fa-round"></i>
                    </span>{" "}
                    {moment(a.attributes.updatedAt).fromNow()}
                  </td>
                </tr>
              </tbody>
            ))}
      </table>
    </div>
  );
};
