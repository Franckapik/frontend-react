import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {  useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Eleve = () => {
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid")
  const cid = searchParams.get("cid")
  const [uid, setEid] = useState()

  const queryClient = useQueryClient()
  const navigate= useNavigate()

  const { isLoading, error, data: eleves } = useQuery('eleves', () =>
    fetch(`http://localhost:1337/api/eleves?populate=*&filters[classe]=${cid}`).then(res =>
      res.json()
    )
  )

  const { isLoading: isUpdating, isSuccess, mutate } = useMutation(async (e) => {
    e.preventDefault();
    setEid(e.target.value)
    navigate({ search: `?pid=${pid}&cid=${cid}&?uid=${e.target.value}` }, {replace: true})

    return apiPost.updateProgression({
      eleve: {
        id: e.target.value
      }
    }, pid)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['progression'])
    }
  })


  return (
      <div>
        <div>
          <p className="title m-3">Selectionne ton nom dans la liste : </p>
        </div>
        <div>
          {!isLoading && (
            <>
              <select
                name="eleve"
                id="eleve-select"
                className="select is-large m-5"
                onChange={mutate}
                defaultValue={-1}
              >
                <option key={"default select"} value={-1} disabled="disabled" >-- selectionne ton prénom --</option>

                {eleves.data.map((eleve) => (
                  <option key={"eleve" + eleve.id} value={eleve.id}>{eleve.attributes.Nom}</option>
                ))}
              </select>
             <a href={`/evaluation?pid=${pid}&cid=${cid}&uid=${uid}`}> Suite</a>
            </>
          )}
        </div>
      </div>
  );
};

export default Eleve;
