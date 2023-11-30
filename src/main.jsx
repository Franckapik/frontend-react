import 'bulma/css/bulma.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import Exercice from "./components/Exercice.jsx";
import Layout from "./components/Layout.jsx";
import { Monitor } from "./components/Monitor";
import './index.css';
import Dashboard from './components/Dashboard.jsx';

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Profile /></Layout>} />
        <Route path="/dashboard" element={<Layout ><Dashboard /></Layout>} />
        <Route path="/exercice" element={<Layout ><Exercice /></Layout>} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
{/*       <ReactQueryDevtools initialIsOpen={false} />
 */}    </BrowserRouter></QueryClientProvider>
  </React.StrictMode>
);
