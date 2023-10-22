import axios from "axios";

export const fetchClasses = (id) =>
  axios
    .create({
      baseURL: `http://localhost:1337/api/classes`,
/*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));

export const fetchByClasseId = (id) =>
  axios
    .create({
      baseURL: `http://localhost:1337/api/classes?populate=*&filters[id]=${id}`,
/*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));

export const fetchByEvaId = (id) =>
  axios
    .create({
      baseURL: `http://localhost:1337/api/evaluations?populate=*&filters[id]=${id}`,
/*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));

export const fetchExerciceByEvaId = (id) =>
  axios
    .create({
      baseURL: `http://localhost:1337/api/exercices?populate=*`,
/*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));

export const fetchProgressionByid = (id) =>
  axios
    .create({
      baseURL: `http://localhost:1337/api/progressions?populate=*&filters[id]=${id}`,
/*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));

export const fetchAllCompetences = () =>
  axios
    .create({
      baseURL: `http://localhost:1337/api/competences?populate=*`,
/*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));
