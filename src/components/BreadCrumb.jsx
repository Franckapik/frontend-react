export const Breadcrumb = ({exercices, setSearchParams, searchParams, exo}) => {

  const pid = searchParams.get("pid");
  const cid = searchParams.get("cid");
  const eid = searchParams.get("eid");
  const uid = searchParams.get("uid");
    return (
        <div>
        <nav className="breadcrumb has-arrow-separator m-2" aria-label="breadcrumbs">
          <ul>
            <li>
              <a href={`/evaluation?pid=${pid}&cid=${cid}&uid=${uid}`} className="p-2">
                Evaluation
              </a>
            </li>
            {exercices.data.map((exercice, i) => {
                return (
                  <li key={"breadcrumb_exo" + i} className={i === Number(exo) ? "is-active" : ""}>
                    <span
                      className="p-2 cursor"
                      onClick={() =>
                        setSearchParams((searchParams) => {
                          searchParams.set("exo", i);
                          return searchParams;
                        })
                      }
                    >
                      Exercice {exercice.attributes.numero}{" "}
                    </span>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    )
}