import React, { useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already signed in and redirect
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Not signed in, proceed
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="sign-in-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Accedi a FestaDeiPiccoli</h1>
          <p>Accedi per gestire i tuoi servizi e messaggi</p>
          <SignIn
            afterSignInUrl="/dashboard"
            signUpUrl="/registrazione"
            routing="path"
            path="/accedi"
          />
          <div className="auth-footer">
            <p>Non sei ancora registrato? <a href="/registrazione">Iscriviti come provider</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
