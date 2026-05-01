import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import DettaglioServizio from './pages/DettaglioServizio';
import ProfiloProvider from './pages/ProfiloProvider';
import ProviderDashboard from './pages/ProviderDashboard';
import CreaServizio from './pages/CreaServizio';
import ModificaServizio from './pages/ModificaServizio';
import Messaggi from './pages/Messaggi';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="loading-container">Caricamento...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/accedi" replace />;
  }

  return children;
}

function AuthTokenSync() {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);
  return null;
}

function App() {
  return (
    <div className="app-container">
      <AuthTokenSync />
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cerca" element={<SearchPage />} />
          <Route path="/servizio/:id" element={<DettaglioServizio />} />
          <Route path="/provider/:id" element={<ProfiloProvider />} />
          <Route path="/accedi/*" element={<SignInPage />} />
          <Route path="/registrazione/*" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/nuovo-servizio"
            element={
              <ProtectedRoute>
                <CreaServizio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/servizio/:id/modifica"
            element={
              <ProtectedRoute>
                <ModificaServizio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messaggi"
            element={
              <ProtectedRoute>
                <Messaggi />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
