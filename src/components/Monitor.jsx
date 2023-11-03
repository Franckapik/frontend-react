import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiPost from "../api/post.js";

export const Monitor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: completions,
  } = useQuery("progressions", () =>
    fetch("http://localhost:1337/api/progressions?populate=*").then((res) => res.json())
  );

  console.log(completions);
  return (
    <div>
      <ul>
        {" "}
        {completions &&
          completions.data.map((a, i) => (
            <li key={"completions" + i}>
              {a.id}- {a.attributes.eleve.data?.attributes.Nom} - {a.attributes.completions.data?.length + "completions"} -{" "}
              {a.attributes.completions.data?.map((a) => a.attributes.points + "pts")}
            </li>
          ))}
      </ul>
    </div>
  );
};
