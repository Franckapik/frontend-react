import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiPost from "../api/post.js";


const Classe = () => {
  const [classeId, setClasseId] = useState(1);
  const [pid, setProgressionId] = useState(sessionStorage.getItem("sessionPid"));
  const navigate = useNavigate()
  const queryClient = useQueryClient();


  const { isLoading, error, data: classes } = useQuery('classes', () =>
    fetch('http://localhost:1337/api/classes').then(res =>
      res.json()
    )
  )

  const { isLoading: isUpdating, isSuccess, mutate } = useMutation(async () => {

    switch (pid) {
      case null:
        const newProgression = await apiPost.postProgression({
          contenu: "my first post",
          creation: moment(),
        })
        console.log("Nouvelle session : " + newProgression);
        sessionStorage.setItem("sessionPid", newProgression.data.id)
        return newProgression
        break;

      default:
        const retrieveProgression = await apiPost.updateProgression({
          reprise: moment()
        }, pid);
        console.log("Reprise de session : " + retrieveProgression.data.id);
        navigate({ search: `?pid=${pid}` })
        return retrieveProgression
        break;
    }

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['progression'])
    }
  })

  useEffect(() => {
    mutate()
  }, [])

  const { mutate: addClasse } = useMutation(async (e) => {
    e.preventDefault();
    setClasseId(e.target.value)
    return apiPost.updateProgression({
      classe: {
        id: e.target.value
      }
    }, pid);

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['progression'])
    }
  })


  return (
    <div className="">
      <div className="column is-half m-auto h-50 has-background-primary box p-3 has-text-centered">
        <div>
          <p className="title m-3">Dans quelle classe est-tu ? </p>
        </div>
        <div>
          {isLoading ? "Chargement" : (
            <select
              name="classes"
              id="classes-select"
              className="select is-large m-5"
              onChange={addClasse}
              defaultValue={-1}
            >
              <option key={"default select"} value="-1"  disabled="disabled" >-- selectionne ta classe --</option>

              {classes.data.map((classe) => (
                <option key={"classe" + classe.id} value={classe.id}>{classe.attributes.Classe}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <a href={`/eleve/${classeId}?pid=${pid}`}> Suite </a>

        </div>
      </div>
    </div>
  );
};

export default Classe;
