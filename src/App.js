import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import MechanicsPage from './pages/MechanicsPage';
import WarehousePage from './pages/WarehousePage';
import AdminPanel from './pages/AdminPanel';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/services"
              element={<ServicesPage />}
            />
            <Route
              path="/mechanics"
              element={<MechanicsPage />}
            />
            <Route
              path="/warehouse"
              element={<WarehousePage />}
            />
            <Route
              path="/admin"
              element={<AdminPanel />}
            />
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/register"
              element={<RegisterPage />}
            />
            <Route
              path="*"
              element={<NotFoundPage />}
            />{' '}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
