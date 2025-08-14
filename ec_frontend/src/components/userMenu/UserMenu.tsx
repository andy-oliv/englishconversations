import { useEffect, useState, type ReactElement } from "react";
import { LoggedUserStore } from "../../stores/loggedUserStore";
import styles from "./styles/UserMenu.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../helper/functions/logout";

export default function UserMenu(): ReactElement {
  function mouseEnter(): void {
    setShowMenu(true);
  }

  function mouseLeave(): void {
    setShowMenu(false);
  }

  const user = LoggedUserStore().data;
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const resetUser = LoggedUserStore((state) => state.resetUser);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <div className={styles.container} onMouseLeave={() => mouseLeave()}>
        <div className={styles.wrapper}>
          {loading ? (
            <div className={styles.loader}></div>
          ) : (
            <img
              className={styles.menuPicture}
              src={user?.avatarUrl}
              onMouseEnter={() => mouseEnter()}
            />
          )}
        </div>
        <div className={`${styles.menu} ${showMenu ? styles.active : ""}`}>
          <p className={styles.menuTitle}>Olá, {user?.name.split(" ")[0]}!</p>
          <div className={styles.menuOptions}>
            <div className={styles.menuOption}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-pencil-icon lucide-pencil"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                  <path d="m15 5 4 4" />
                </svg>
              </div>
              <Link to="/edit-profile" className={styles.link}>
                Editar perfil
              </Link>
            </div>
            <div className={styles.menuOption}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail-icon lucide-mail"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
              </div>
              <Link to="/edit-email" className={styles.link}>
                Alterar email
              </Link>
            </div>
            <div className={styles.menuOption}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-key-round-icon lucide-key-round"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </div>
              <Link to="/edit-password" className={styles.link}>
                Alterar senha
              </Link>
            </div>
            <button
              className={styles.btn}
              onClick={() => logout(user, resetUser, navigate)}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
