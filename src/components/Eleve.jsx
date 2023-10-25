import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import * as apiPost from "../api/post.js";

const Eleve = () => {
  let { classeId } = useParams();
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid")



  const queryClient = useQueryClient()

  const { isLoading, error, data: eleves } = useQuery('eleves', () =>
    fetch(`http://localhost:1337/api/eleves?populate=*&filters[classe]=${classeId}`).then(res =>
      res.json()
    )
  )

  const { isLoading: isUpdating, isSuccess, mutate } = useMutation(async (e) => {
    e.preventDefault();
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
    <div className="">
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
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
             <a href={`/evaluation/${classeId}?pid=${pid}`}> Suite</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eleve;
