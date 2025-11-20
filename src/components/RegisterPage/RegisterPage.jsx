import { useState } from 'react';
import { useNavigate } from 'react-router';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
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
      case 'passwordConfirmation':
        setPasswordConfirmation(value);
    }
  }

  function handleRegistration() {
    // Check if username already exists
    fetch(import.meta.env.VITE_API + `/users/${username.trim().toLowerCase()}`)
      .then((response) => response.json())
      .then((response) => {
        // If the user exists
        if (response.success) {
          return setError('Username is already being used.');
        }
      })
      .catch((error) => {
        setError(error.message);
      });

    // Check if password field is empty
    if (password === '') {
      return setError('Password cannot be empty.');
    }

    // Check if password and confirmation match
    if (password !== passwordConfirmation) {
      return setError('Password and confirmation do not match.');
    }

    // Register a new user
    fetch(import.meta.env.VITE_API + '/users', {
      method: 'POST',
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
          return setError('Could not register at this time.');
        }

        navigate('/login');
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      <h1>Register</h1>
      {error && <p>{error}</p>}
      <form>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleRegistration}>
          Register
        </button>
      </form>
    </>
  );
}

export default RegisterPage;
