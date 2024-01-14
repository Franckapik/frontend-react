import axios from "axios";
import moment from "moment";

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

export const setNote = ({ note, points, pid }) => {
  return axios
    .put(`https://strapi.eva-svt.ovh/api/progressions/${pid}?populate=*`, {
      data: {
        note: note,
        points : points,
      },
      pid: pid,
    })
    .then((response) => {
      console.info("[PUT] [Update Note in Progression] [/api/progressions] on id : " + pid);
      return response.data.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const setCompletion = ({ pid, qid, eid }) => {
  return axios
    .post(`https://strapi.eva-svt.ovh/api/completions?populate=*`, {
      data: {
        progression: {
          id: pid,
        },
        question: {
          id: qid,
        },
        exercice: {
          id: eid,
        },
      },
    })
    .then((response) => {
      console.info("[POST] [Completion] [/api/completions]");
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const setCompletionResponse = ({ texte, type, rid, isSelected, points, comp, niveau, cid }) => {
  const updateCompletion = ({ cid, data }) =>
    axios
      .put(`https://strapi.eva-svt.ovh/api/completions/${cid}?populate=*`, {
        data: data,
      })
      .then((response) => {
        console.info(`[UPDATE] [Completion] [/api/completions/${cid}]`);
        return response.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });

  if (type === "choix multiple") {
    switch (true) {
      case isSelected === false || isSelected == 0:
        return updateCompletion({
          data: {
            reponses: {
              connect: [rid],
            },
            points: points,
            validation: [
              {
                competence: comp,
                niveau: niveau,
              },
            ],
          },
          cid: cid,
        });
        break;

      case isSelected === true:
        return updateCompletion({
          data: {
            reponses: {
              disconnect: [rid],
            },
            points: points,
            validation: [
              {
                competence: comp,
                niveau: niveau,
              },
            ],
          },
          cid: cid,
        });
        break;

      default:
        break;
    }
  } else if (type === "choix simple") {
    return updateCompletion({
      data: {
        reponses: {
          set: [rid] /* disconnect, connect, set*/,
        },
        points: points,
        validation: [
          {
            competence: comp,
            niveau: niveau,
          },
        ],
      },
      cid: cid,
    });
  } else if (type === "texte") {
    return updateCompletion({
      data: {
        contenu: texte,
        points: points,
        validation: [
          {
            competence: comp,
            niveau: niveau,
          },
        ],
      },
      cid: cid,
    });
  }
};
