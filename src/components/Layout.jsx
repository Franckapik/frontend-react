import { Progression } from "./Progression";

export default function Layout({ title, toolbar, children }) {
    return (
      <div>
        <header>
{/*           <h1>{title}</h1>
 */}          <Progression ></Progression>
        </header>
        <main>{children}</main>
      </div>
    )
  }