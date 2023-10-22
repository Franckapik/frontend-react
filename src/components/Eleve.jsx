import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiFetch from "../api/fetch.js";
import * as apiPost from "../api/post.js";
import { Progression } from "./Progression.jsx";

const Eleve = () => {
  const [eleves, setEleves] = useState([]);
  const [classe, setClasse] = useState([]);
  const [eleveId, setEleveId] = useState([]);
  let { classeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pid = searchParams.get("pid")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch.fetchByClasseId(classeId);
      setEleves(result.data[0].attributes.eleve.data);
      setClasse(result.data[0].attributes.Classe);
    };
    fetchData();

  }, [classeId, pid]);

  const setEleveInProgression = async () => {
      const result = await apiPost.updateProgression({
        
          eleve: {
            id: eleveId
          }
        
      }, pid);

        navigate(`/evaluation/${classeId}?pid=${pid}`, {replace:true})

    };
    
  

  return (
    <div className="is-flex h-100 columns is-flex is-vcentered ">
              <Progression></Progression>

      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Selectionne ton nom dans la liste : </p>
        </div>
        <div>
          {eleves.length > 0 && (
           <>
              <select
                name="eleve"
                id="eleve-select"
                className="select is-large m-5"
                onChange={(e) => setEleveId(e.target.value)}
              >
                {eleves.map((eleve) => (
                  <option key={"eleve" + eleve.id} value={eleve.id}>{eleve.attributes.Nom}</option>
                ))}
              </select>
           <button  onClick={()=> setEleveInProgression()}>Suite</button>
           </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eleve;
