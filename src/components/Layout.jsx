import { Progression } from "./Progression";

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <Progression ></Progression>
      </header>
      <main className="m-auto header_blank ">{children}</main>
    </div>
  )
}