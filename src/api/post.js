import axios from "axios";
import moment from "moment";

export const postCompletion = (data) =>
  axios
    .post(`https://strapi.eva-svt.ovh/api/completions?populate=*`, {
      data: data,
    })
    .then((response) => {
      console.info("[POST] [Completion] [/api/completions]");
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

export const updateCompletion = (data, id) =>
  axios
    .put(`https://strapi.eva-svt.ovh/api/completions/${id}?populate=*`, {
      data: data,
    })
    .then((response) => {
      console.info(`[UPDATE] [Completion] [/api/completions/${id}]`);
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

export const setProgression = ({ pid, cid, uid }) => {
  switch (pid) {
    /* new session */
    case null:
      return axios
        .post(`https://strapi.eva-svt.ovh/api/progressions`, {
          data: {
            creation: moment(),
            classe: {
              id: cid,
            },
            eleve: {
              id: uid,
            },
          },
        })
        .then((response) => {
          console.info("[POST] [Progression] [/api/progressions]");
          sessionStorage.setItem("pid", response.data.data.id);
          console.log("Nouvelle session : " + response.data.data.id);
          return response.data.data;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });

    /* old session */
    default:
      return axios
        .put(`https://strapi.eva-svt.ovh/api/progressions/${pid}?populate=*`, {
          data: {
            data: {
              reprise: moment(),
            },
            pid: pid,
          },
        })
        .then((response) => {
          console.info("[PUT] [Update Progression] [/api/progressions] on id : " + pid);
          console.info("Reprise de session existante");
          return response.data.data;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
  }
};

export const setEvaId = ({ evaId, pid }) => {
  return axios
        .put(`https://strapi.eva-svt.ovh/api/progressions/${pid}?populate=*`, {
          data: {
            evaluation: {
              id: evaId,
            },
          },
          pid: pid,
        })
        .then((response) => {
          console.info("[PUT] [Add Evaluation Id in Progression] [/api/progressions] on id : " + pid);
          console.info("Reprise de session existante");
          return response.data.data;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
};

export const setPoints = ({ note, pid }) => {
  return axios
        .put(`https://strapi.eva-svt.ovh/api/progressions/${pid}?populate=*`, {
          data: {
            points: note,
          },
          pid: pid,
        })
        .then((response) => {
          console.info("[PUT] [Update Points in Progression] [/api/progressions] on id : " + pid);
          return response.data.data;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
};

export const setCompletion = ({ pid, qid, eid }) => {
  return apiPost.postCompletion({
    progression: {
      id: pid,
    },
    question: {
      id: qid,
    },
    exercice: {
      id: eid,
    },
  });
};

export const setCompletionResponse = ({ texte, type, rid, isSelected, score, comp, niveau }) => {
  if (type === "choix multiple") {
    switch (true) {
      case isSelected === false || isSelected == 0:
        return apiPost.updateCompletion(
          {
            reponses: {
              connect: [rid],
            },
            points: score,
            validation: [
              {
                competence: comp,
                niveau: niveau,
              },
            ],
          },
          completion.data[0].id
        );
        break;

      case isSelected === true:
        return apiPost.updateCompletion(
          {
            reponses: {
              disconnect: [rid],
            },
            points: score,
            validation: [
              {
                competence: comp,
                niveau: niveau,
              },
            ],
          },
          completion.data[0].id
        );
        break;

      default:
        break;
    }
  } else if (type === "choix simple") {
    return apiPost.updateCompletion(
      {
        reponses: {
          set: [rid] /* disconnect, connect, set*/,
        },
        points: score,
        validation: [
          {
            competence: comp,
            niveau: niveau,
          },
        ],
      },
      completion.data[0].id
    );
  } else if (type === "texte") {
    console.log(texte);
    return apiPost.updateCompletion(
      {
        contenu: texte,
        points: score,
        validation: [
          {
            competence: comp,
            niveau: niveau,
          },
        ],
      },
      completion.data[0].id
    );
  }
};
