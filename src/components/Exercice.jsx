import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "./BreadCrumb.jsx";
import { Exo } from "./Exo.jsx";
import * as apiPost from "../api/post.js";


const Exercice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const eid = searchParams.get("eid");
  const pid = searchParams.get("pid");
  const papier = searchParams.get("papier");
  const queryClient = useQueryClient();

  const [pointsEva, setPointsEva] = useState([]);

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
    isLoading,
    error,
    data: exercices,
    isSuccess,
  } = useQuery("exercices", () =>
    fetch(`http://localhost:1337/api/exercices?populate=*&filters[evaluation]=${eid}`).then((res) => res.json())
  );

  useEffect(() => {
    const note = Object.values(pointsEva).reduce((acc, val) => acc += val, 0)
    changeNote(note)
  }, [pointsEva])

  return (
    <div>
      {papier !== null && (
        <div className="printbutton has-text-centered m-3">
          <button onClick={() => window.print()}>Imprimer</button>

          <style>{`@media print {.printbutton{display: none;}}`}</style>
        </div>
      )}
      {isSuccess && exo && (
        <Breadcrumb exercices={exercices} setSearchParams={setSearchParams} searchParams={searchParams} exo={exo} />
      )}
      <div className={papier !== null ? `is-size-4` : `has-text-centered is-size-4`}>
        {isSuccess &&
          exercices.data
            .filter((a, i) => (exo !== null ? i == exo : true))
            .map((exercice) => <Exo exercice={exercice} setPointsEva={setPointsEva} />)}
        {isSuccess && exo && (
          <div>
            {exo < exercices.data.length - 1 ? (
              <button
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.set("exo", Number(exo + 1));
                    return searchParams;
                  })
                }
              >
                Suivant
              </button>
            ) : (
              "Retour"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercice;
