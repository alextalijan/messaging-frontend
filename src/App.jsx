import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import UserContext from './contexts/UserContext';

function App() {
  return (
    <UserContext.Provider value={{}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
