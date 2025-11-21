import { Link } from 'react-router';
import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import { Navigate } from 'react-router';

function WelcomePage() {
  const { user } = useContext(UserContext);
  if (user) {
    return <Navigate to="/chats" />;
  }

  return (
    <>
      <h1>Welcome to AlexChat!</h1>
      <p>Please log in or register to start chatting with your friends.</p>
      <div>
        <Link to={'/login'}>Log In</Link>
        <Link to={'/register'}>Register</Link>
      </div>
    </>
  );
}

export default WelcomePage;
