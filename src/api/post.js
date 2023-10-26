import axios from "axios";

export const postProgression = (data) =>
  axios
    .post(`http://localhost:1337/api/progressions`, {
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
    .put(`http://localhost:1337/api/progressions/${id}?populate=*`, {
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
    .post(`http://localhost:1337/api/completions`, {
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
