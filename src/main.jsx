import 'bulma/css/bulma.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import Evaluation from "./components/Evaluation.jsx";
import Layout from "./components/Layout.jsx";
import { Monitor } from "./components/Monitor";
import './index.css';
import Dashboard from './components/Dashboard.jsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Profile /></Layout>} />
        <Route path="/dashboard" element={<Layout ><Dashboard /></Layout>} />
        <Route path="/evaluation" element={<Layout ><Evaluation /></Layout>} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter></QueryClientProvider>
  </React.StrictMode>
);
