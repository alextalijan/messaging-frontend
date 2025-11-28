import { useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  function handleInputChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  }

  function handleLogin() {
    fetch(import.meta.env.VITE_API + '/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setError(response.message);
        }

        login(response.user.id, response.user.username);
        navigate('/chats');
      });
  }

  return (
    <>
      <h1 className={styles.h1}>Log In</h1>
      {error && <p>{error}</p>}
      <form className={styles.form}>
        <label className={styles.input}>
          <span className={styles['input-name']}>Username :</span>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            className={styles['input-field']}
          />
        </label>
        <label className={styles.input}>
          <span className={styles['input-name']}>Password&nbsp; :</span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            className={styles['input-field']}
          />
        </label>
        <div className={styles['btn-container']}>
          <button type="button" onClick={handleLogin} className={styles.btn}>
            Log In
          </button>
        </div>
      </form>
      <p className={styles['register-msg']}>
        Don't have an account?{' '}
        <Link to="/register" className={styles.link}>
          Register
        </Link>
      </p>
    </>
  );
}

export default LoginPage;
