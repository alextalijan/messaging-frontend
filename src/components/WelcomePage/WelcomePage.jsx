import { Link } from 'react-router';

function WelcomePage() {
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
