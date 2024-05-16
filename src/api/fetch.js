import axios from "axios";

export const getClasses = () => fetch("https://strapi.eva-svt.ovh/api/classes?populate=*").then((res) => res.json());

export const getProgression = (pid) =>
  fetch(`https://strapi.eva-svt.ovh/api/progressions?populate=*&filters[id]=${pid}`).then((res) => res.json());

export const getProgressionByClasse = (cid) =>
  fetch(`https://strapi.eva-svt.ovh/api/progressions?populate=*&filters[classe]=${cid}`).then((res) => res.json());

export const getProgressionByEleve = (uid, eid) =>
  fetch(`https://strapi.eva-svt.ovh/api/progressions?populate=*&filters[eleve]=${uid}&filters[evaluation]=${eid}`).then((res) => res.json());

export const getEvaluations = (cid) =>
  fetch(`https://strapi.eva-svt.ovh/api/evaluations?populate=*&filters[classes]=${cid}`).then((res) => res.json());

export const getEva = (eid) =>
  fetch(`https://strapi.eva-svt.ovh/api/exercices?populate=*&filters[evaluation]=${eid}`).then((res) => res.json());

export const getExo = (exid) =>
  fetch(`https://strapi.eva-svt.ovh/api/questions?populate=*&filters[exercice]=${exid}`).then((res) => res.json());

export const getCompletionByQID = ({pid, qid}) =>{
  return axios
    .create({
      baseURL: `https://strapi.eva-svt.ovh/api/completions?populate[0]=reponses&filters[progression]=${pid}&filters[question]=${qid}`,
    })
    .get()
    .then((response) => {
      if (response.data.data.length > 0) {
        return(response.data.data[0])
      } else {
        return null
      }
    })
    .catch((error) => Promise.reject(error));}
