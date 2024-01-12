import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useEvaParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const exo = searchParams.get("exo");
  const eid = searchParams.get("eid");
  const pid = searchParams.get("pid");
  const uid = searchParams.get("uid");
  const cid = searchParams.get("cid");
  const papier = searchParams.get("papier");
  const correction = searchParams.get("correction");

  return {exo : exo, eid : eid, pid:pid, papier : papier, correction : correction, uid: uid, cid : cid};
}
