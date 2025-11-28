import { Link } from 'react-router';
import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import { Navigate } from 'react-router';
import styles from './WelcomePage.module.css';

function WelcomePage() {
  const { user } = useContext(UserContext);
  if (user) {
    return <Navigate to="/chats" />;
  }

  return (
    <>
      <h1 className={styles.h1}>Welcome to AlexChat!</h1>
      <p className={styles['login-msg']}>
        Please log in or register to start chatting with your friends.
      </p>
      <div className={styles['login-links']}>
        <Link
          to={'/login'}
          className={`${styles.link} ${styles['login-link']}`}
        >
          Log In
        </Link>
        <Link to={'/register'} className={styles.link}>
          Register
        </Link>
      </div>
    </>
  );
}

export default WelcomePage;
