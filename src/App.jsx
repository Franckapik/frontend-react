import React, { useEffect, useState } from "react";
import * as apiFetch from "./api/fetch.js";

const App = () => {
  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState(1);

  const selectClasse = (id) => {
    setClasseId(id)
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch.fetchClasses();
      setClasses(result.data);
    };
    fetchData();
  }, []);

  return (
    <div className="is-flex h-100 columns is-flex is-vcentered ">
App
    </div>
  );
};

export default App;
