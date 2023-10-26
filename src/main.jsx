import React from "react";
import ReactDOM from "react-dom/client";
import 'bulma/css/bulma.min.css';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Evaluation from "./components/Evaluation";
import Eleve from "./components/Eleve";
import Classe from "./components/Classe.jsx";
import Exercice from "./components/Exercice.jsx";
import Layout from "./components/Layout.jsx";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout title={"Classe"}><Classe /></Layout>} />
        <Route path="/evaluation/:classeId" element={<Layout title={"Evaluation"}><Evaluation /></Layout>} />
        <Route path="/:evaId/exercice" element={<Layout title={"Exercice"}><Exercice /></Layout>} />
        <Route path="/eleve/:classeId" element={<Layout title={"Eleve"}><Eleve /></Layout>} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter></QueryClientProvider>
  </React.StrictMode>
);
