import type { ReactElement } from "react";
import MainMenu from "../../components/mainMenu/MainMenu";
import styles from "./styles/Home.module.scss";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";

export default function Home(): ReactElement {
  return (
    <>
      <div className={styles.homeScreen}>
        <div className={styles.menuWrapper}>
          <MainMenu />
        </div>
        <div className={styles.mainContent}>
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}
