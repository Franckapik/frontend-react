import axios from "axios";

export const postProgression = (data) =>
  axios
    .post(`https://strapi.eva-svt.ovh/api/progressions`, {
      data: data,
    })
    .then((response) => {
      console.info("[POST] [Progression] [/api/progressions]");
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

export const updateProgression = (data, id) =>
  axios
    .put(`https://strapi.eva-svt.ovh/api/progressions/${id}?populate=*`, {
      data: data,
    })
    .then((response) => {
      console.info("[PUT] [Update Progression] [/api/progressions] on id : " + id);
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

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
