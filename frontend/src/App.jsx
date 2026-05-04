import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadData from './pages/UploadData';
import MapPage from './pages/MapPage';
import StateInsights from './pages/StateInsights';
import Login from './pages/Login';
import { useState } from 'react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar onLogout={() => setIsAuthenticated(false)} />}
        <main className={isAuthenticated ? "main-content" : "auth-container"}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />
            } />
            <Route path="/" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } />
            <Route path="/upload" element={
              isAuthenticated ? <UploadData /> : <Navigate to="/login" />
            } />
            <Route path="/map" element={
              isAuthenticated ? <MapPage /> : <Navigate to="/login" />
            } />
            <Route path="/insights" element={
              isAuthenticated ? <StateInsights /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>

    </Router>
  );
}

export default App;
