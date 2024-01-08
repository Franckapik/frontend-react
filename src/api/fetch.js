import axios from "axios";

export const fetchClasses = (id) =>
  axios
    .create({
      baseURL: `https://strapi.eva-svt.ovh/api/classes`,
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
      baseURL: `https://strapi.eva-svt.ovh/api/classes?populate=*&filters[id]=${id}`,
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
      baseURL: `https://strapi.eva-svt.ovh/api/evaluations?populate=*&filters[id]=${id}`,
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
      baseURL: `https://strapi.eva-svt.ovh/api/exercices?populate=*`,
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
      baseURL: `https://strapi.eva-svt.ovh/api/progressions?populate=*&filters[id]=${id}`,
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
      baseURL: `https://strapi.eva-svt.ovh/api/competences?populate=*`,
      /*       headers: {
        Accept: "application/json",
        DOLAPIKEY: "7VsbrNpR2wLvcX5XUJ933qYsy33Vx64Q",
      }, */
    })
    .get()
    .then((response) => response.data)
    .catch((error) => Promise.reject(error));

export const getClasses = () => fetch("https://strapi.eva-svt.ovh/api/classes?populate=*").then((res) => res.json());
