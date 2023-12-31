import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";
import { Exo } from "./Exo.jsx";


const Evaluation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const eid = searchParams.get("eid");
  const pid = searchParams.get("pid");
  const papier = searchParams.get("papier");
  const queryClient = useQueryClient();
  const correction = searchParams.get("correction");


  const [pointsEva, setPointsEva] = useState([]);
  const [compsEva, setCompsEva] = useState([]);

  const navigate = useNavigate();

  const { mutate: changeNote } = useMutation(
    async (note) => {
      return apiPost.updateProgression({
        points: note,
      }, pid);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["progression"]);
      },
    }
  );

  const {
    data: exercices,
    isSuccess,
  } = useQuery("exercices", () =>
    fetch(`https://strapi.eva-svt.ovh/api/exercices?populate=*&filters[evaluation]=${eid}`).then((res) => res.json())
  );

  useEffect(() => {
    if (correction === null) {
      const note = Object.values(pointsEva).reduce((acc, val) => acc += val, 0)
      changeNote(note)
    }
  }, [pointsEva, correction])

  useEffect(() => {
    if (correction === null) {
      /* const note = Object.values(pointsEva).reduce((acc, val) => acc += val, 0)
      changeNote(note) */
    }
  }, [compsEva, correction])

  return (
    <div >
      {papier !== null && (
        <div className="printbutton has-text-centered m-3">
          <button onClick={() => window.print()}>Imprimer</button>

          <style>{`@media print {.printbutton{display: none;}}`}</style>
        </div>
      )}

      <div className={papier !== null ? `is-size-6` : `has-text-centered is-size-4`}>
        {isSuccess &&
          exercices.data
            .filter((a, i) => (exo !== null ? i == exo : true))
            .map((exercice, i) => <Exo key={"exo" + i} exercice={exercice} setPointsEva={setPointsEva} setCompsEva={setCompsEva} />)}
        {isSuccess && exo && (
          <div>
            {exo > 0  ? (
              <button
              className="button is-medium m-2"
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.set("exo", Number(exo) - 1);
                    return searchParams;
                  })
                }
              >
                Exercice précédent
              </button>
            ) : (
              ""
            )}
            {exo < exercices.data.length - 1 ? (
              <button
              className="button is-medium m-2"
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.set("exo", Number(exo) + 1);
                    return searchParams;
                  })
                }
              >
                Exercice suivant
              </button>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
