import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "./BreadCrumb.jsx";
import { Exo } from "./Exo.jsx";

const Exercice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const eid = searchParams.get("eid");

  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data: exercices,
    isSuccess,
  } = useQuery("exercices", () =>
    fetch(`http://localhost:1337/api/exercices?populate=*&filters[evaluation]=${eid}`).then((res) => res.json())
  );

  return (
    <div>
      {isSuccess && (
        <Breadcrumb exercices={exercices} setSearchParams={setSearchParams} searchParams={searchParams} exo={exo} />
      )}
      <div className="is-size-4">
        {isSuccess && exercices.data.filter((a,i) => i == exo).map((exercice) => <Exo exercice={exercice} />)}
        {isSuccess && exo && (
          <div>
            {exo < exercices.data.length - 1 ? (
              <button onClick={() =>
                setSearchParams((searchParams) => {
                  searchParams.set("exo", Number(exo + 1));
                  return searchParams;
                })
              } >Suivant</button>
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
