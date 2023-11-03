import 'bulma/css/bulma.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Classe from "./components/Classe.jsx";
import Evaluation from "./components/Evaluation";
import Exercice from "./components/Exercice.jsx";
import Layout from "./components/Layout.jsx";
import { Monitor } from "./components/Monitor";
import './index.css';

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout title={"Classe"}><Classe /></Layout>} />
        <Route path="/evaluation" element={<Layout title={"Evaluation"}><Evaluation /></Layout>} />
        <Route path="/exercice" element={<Layout title={"Exercice"}><Exercice /></Layout>} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter></QueryClientProvider>
  </React.StrictMode>
);
