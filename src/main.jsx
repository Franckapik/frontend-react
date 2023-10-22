import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'bulma/css/bulma.min.css';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Evaluation from "./components/Evaluation";
import Eleve from "./components/Eleve";
import Classe from "./components/Classe.jsx";
import Exercice from "./components/Exercice.jsx";
import Layout from "./components/Layout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout title={"Classe"}><Classe /></Layout>} />
        <Route path="/evaluation/:classeId" element={<Layout title={"Evaluation"}><Evaluation /></Layout>} />
        <Route path="/exercice/:evaId" element={<Layout title={"Exerices"}><Exercice /></Layout>} />
        <Route path="/eleve/:classeId" element={<Layout title={"Eleve"}><Eleve /></Layout>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
