import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import WelcomePage from './components/WelcomePage/WelcomePage';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  function login(id, username) {
    setUser({ id, username });
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
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
