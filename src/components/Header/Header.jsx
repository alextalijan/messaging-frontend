import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link } from 'react-router';

function Header() {
  const { user } = useContext(UserContext);

  return (
    <header>
      {user ? (
        <>
          <Link to="/">Chats</Link>
          <Link to="/profile">My Profile</Link>
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
