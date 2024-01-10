import React from "react";
import { useSearchParams } from "react-router-dom";

export const BreadCrumbExo = ({ exo, exoMax }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      {exo > 0 ? (
        <button
          className="button is-medium m-2"
          onClick={() => setSearchParams((searchParams) => {
            searchParams.set("exo", Number(exo) - 1);
            return searchParams;
          })}
        >
          Exercice précédent
        </button>
      ) : (
        ""
      )}
      {exo < exoMax - 1 ? (
        <button
          className="button is-medium m-2"
          onClick={() => setSearchParams((searchParams) => {
            searchParams.set("exo", Number(exo) + 1);
            return searchParams;
          })}
        >
          Exercice suivant
        </button>
      ) : (
        ""
      )}
    </div>
  );
};
