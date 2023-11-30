import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";

export const Breadcrumb = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const exo = searchParams.get("exo");
  const eid = searchParams.get("eid");
  const pid = searchParams.get("pid");
  const cid = searchParams.get("cid");
  const uid = searchParams.get("uid");

  const { data: exercices, isSuccess } = useQuery("exercices", () =>
    fetch(`https://strapi.eva-svt.ovh/api/exercices?populate=*&filters[evaluation]=${eid}`).then((res) => res.json())
  );
  return (
    <div>
      {isSuccess && (
        <nav className="breadcrumb has-arrow-separator " aria-label="breadcrumbs">
          <button className="button exit_eva_btn is-light has-text-black mt-2">
            <a href={`/dashboard?pid=${pid}&cid=${cid}&uid=${uid}`} className="p-2">
              <i className="fa-solid fa-circle-xmark"></i> <span className="ml-3">Quitter l'évaluation</span>
            </a>
          </button>
          <ul>
            {exercices.data.map((exercice, i) => {
              return (
                <li key={"breadcrumb_exo" + i} className={i === Number(exo) ? "is-active" : ""}>
                  <button
                    className="button m-2"
                    onClick={() =>
                      setSearchParams((searchParams) => {
                        searchParams.set("exo", i);
                        return searchParams;
                      })
                    }
                  >
                    Exercice {exercice.attributes.numero}{" "}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};
