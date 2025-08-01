import type { ReactElement } from "react";
import { LoggedUserStore } from "../../stores/loggedUserStore";

export default function Home(): ReactElement {
  const loggedUser = LoggedUserStore();

  return (
    <>
      <h1>Olá, {loggedUser.data?.name.split(" ")[0]}!</h1>
    </>
  );
}
