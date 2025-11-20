import { useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
          return alert('Could not log in. Please try again later.');
        }

        login(response.user.id, response.user.username);
        navigate('/chats');
      });
  }

  return (
    <>
      <h1>Log In</h1>
      <form>
        <label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
          Username:
        </label>
        <label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
          Password:
        </label>
        <button type="button" onClick={handleLogin}>
          Log In
        </button>
      </form>
    </>
  );
}

export default LoginPage;
