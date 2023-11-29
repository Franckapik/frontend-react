import { Progression } from "./Progression";

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <Progression ></Progression>
      </header>
      <main className=" m-auto p-3 ">{children}</main>
    </div>
  )
}