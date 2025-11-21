import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link } from 'react-router';

function Header() {
  const { user, logout } = useContext(UserContext);

  return (
    <header>
      {user ? (
        <>
          <Link to="/">Chats</Link>
          <Link to="/profile">My Profile</Link>
          <button type="button" onClick={() => logout()}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Log In</Link>
        </>
      )}
    </header>
  );
}

export default Header;
