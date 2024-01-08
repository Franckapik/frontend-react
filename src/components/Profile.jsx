import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cid, setClasseId] = useState();
  const [uid, setEleveId] = useState();
  const sessionPid = sessionStorage.getItem("sessionPid");
  const queryClient = useQueryClient();
  const navigate = useNavigate()


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
        navigate(`/dashboard?pid=${searchParams.get("pid")}&cid=${cid}&uid=${uid}`)
      },
    }
  );

  return (
    <div className="m-2 p-5 has-text-centered">
      <div>
        {isSuccessClasse && classes.data?.length ? (
          <select
            name="classes"
            id="classes-select"
            className="select is-large m-5 w300"
            onChange={(e) => setClasseId(e.target.value)}
            defaultValue={-1}
          >
            <option key={"default select"} value="-1" disabled="disabled">
              -- Dans quelle classe est-tu ? --
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
      {cid ? <div>
        <div>
          <select
            name="eleve"
            id="eleve-select"
            className="select is-large m-5 w300 "
            defaultValue={-1}
            onChange={(e) => setEleveId(e.target.value)}
          >
            <option key={"default select"} value={-1} disabled="disabled">
              -- Quel est-ton nom ?  --
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
      </div> : ""}
      {cid && uid ? <button className="button  is-medium  is-outlined" onClick={changeProgression}>Evaluation</button>
        : ""}</div>
  );
};

export default Profile;
