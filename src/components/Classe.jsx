import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Classe = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cid, setClasseId] = useState();
  const [uid, setEleveId] = useState();
  const sessionPid = sessionStorage.getItem("sessionPid");
  const queryClient = useQueryClient();
  const navigate= useNavigate()


  const {
    isSuccess: isSuccessClasse,
    data: classes,
  } = useQuery("classes", () => fetch("https://strapi.eva-svt.ovh/api/classes?populate=*").then((res) => res.json()));

  const {
    mutate: changeProgression,
  } = useMutation(
    async () => {
      switch (sessionPid) {
        case null:
          const newProgression = await apiPost.postProgression({
            creation: moment(),
            classe: {
              id: cid,
            },
            eleve: {
              id: uid,
            },
          });
          sessionStorage.setItem("sessionPid", newProgression.data.id);
          console.log("Nouvelle session : " + newProgression.data.id);
          setSearchParams((a) => {
            a.set("pid", newProgression.data.id);
            return searchParams;
          })
          return newProgression;
          break;

        default:
          const retrieveProgression = await apiPost.updateProgression(
            {
              reprise: moment(),
            },
            sessionPid
          );
          console.log("Reprise de session : " + retrieveProgression.data.id);
          setSearchParams((a) => {
            a.set("pid", sessionPid);
            return searchParams;
          })
          return retrieveProgression;
          break;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["progression"]);
        navigate(`/evaluation?pid=${searchParams.get("pid")}&cid=${cid}&uid=${uid}`)
      },
    }
  );

  return (
    <div>
      <div>
        <p className="title m-3">Dans quelle classe est-tu ? </p>
      </div>
      <div>
        {isSuccessClasse && classes.data?.length ? (
          <select
            name="classes"
            id="classes-select"
            className="select is-large m-5"
            onChange={(e) => setClasseId(e.target.value)}
            defaultValue={-1}
          >
            <option key={"default select"} value="-1" disabled="disabled">
              -- classes de Pierre Perrin --
            </option>

            {classes.data?.map((classe) => (
              <option key={"classe" + classe.id} value={classe.id}>
                {classe.attributes.Classe}
              </option>
            ))}
          </select>
        ) : (
          "Chargement"
        )}
      </div>
      <div>
        <div>
          <select
            name="eleve"
            id="eleve-select"
            className="select is-large m-5"
            defaultValue={-1}
            onChange={(e) => setEleveId(e.target.value)}
          >
            <option key={"default select"} value={-1} disabled="disabled">
              -- selectionne ton prénom --
            </option>
            {cid &&
              classes?.data
                .filter((a) => a.id == cid)[0]
                .attributes.eleve.data.map((eleve) => (
                  <option key={"eleve" + eleve.id} value={eleve.id}>
                    {eleve.attributes.Nom}
                  </option>
                ))}
          </select>
        </div>
      </div>
      <button onClick={changeProgression}>Evaluation</button>
    </div>
  );
};

export default Classe;
