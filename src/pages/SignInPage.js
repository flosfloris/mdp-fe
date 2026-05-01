import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import './SignInPage.css';

function SignInPage() {
  return (
    <div className="sign-in-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Accedi a FestaDeiPiccoli</h1>
          <p>Accedi per gestire i tuoi servizi e messaggi</p>
          <SignIn
            fallbackRedirectUrl="/dashboard"
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
