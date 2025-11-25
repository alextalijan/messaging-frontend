import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link } from 'react-router';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useContext(UserContext);

  return (
    <>
      <header className={styles.header}>
        {user ? (
          <>
            <Link className={styles.link} to="/">
              Chats
            </Link>
            <Link className={styles.link} to="/profile">
              My Profile
            </Link>
            <button
              className={styles.link}
              type="button"
              onClick={() => logout()}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link className={styles.link} to="/register">
              Register
            </Link>
            <Link className={styles.link} to="/login">
              Log In
            </Link>
          </>
        )}
      </header>
      <hr />
    </>
  );
}

export default Header;
