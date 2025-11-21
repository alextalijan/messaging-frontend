import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import WelcomePage from './components/WelcomePage/WelcomePage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ChatPage from './components/ChatPage/ChatPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Log the user in if there's an existing session
  useEffect(() => {
    fetch(import.meta.env.VITE_API + '/users/me', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => setUser(response.user))
      .finally(() => setLoading(false));
  }, []);

  function login(id, username) {
    setUser({ id, username });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <UserContext.Provider value={{ user, login }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<WelcomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/chats" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>{' '}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
