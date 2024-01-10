import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../api/fetch.js";
import { setProgression } from "../api/post.js";

const Profile = () => {
  const [cid, setClasseId] = useState();
  const [uid, setEleveId] = useState();
  const sessionPid = sessionStorage.getItem("sessionPid");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    isSuccess,
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getClasses(),
  });

  const changeProgression = useMutation({
    mutationFn: (data) => setProgression(data),
    mutationKey: ["setProgression"],
    onSuccess: (data) => {
      queryClient.invalidateQueries(["progression"]);
      navigate(`/dashboard?&pid=${data.id}&cid=${cid}&uid=${uid}`);
    },
  });

  if (isLoading) return "Chargement...";
  if (error) console.log("An error occurred while fetching the user data ", error);
  if (isSuccess)
    return (
      <div className="m-2 p-5 has-text-centered">
        <div>
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
        </div>
        {cid && (
          <div>
            <div>
              <select
                name="eleve"
                id="eleve-select"
                className="select is-large m-5 w300 "
                defaultValue={-1}
                onChange={(e) => setEleveId(e.target.value)}
              >
                <option key={"default select"} value={-1} disabled="disabled">
                  -- Quel est-ton nom ? --
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
        )}
        {cid && uid && (
          <button
            className="button  is-medium  is-outlined"
            onClick={() => changeProgression.mutate({ pid: sessionPid, cid: cid, uid: uid })}
          >
            Evaluation
          </button>
        )}
      </div>
    );
};

export default Profile;
