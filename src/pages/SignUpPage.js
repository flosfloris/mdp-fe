import React, { useState } from 'react';
import { SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './SignUpPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useAuth();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    tipo_provider: 'location',
    nome_attivita: '',
    citta: '',
    regione: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!profileData.nome_attivita.trim()) {
        throw new Error('Il nome dell\'attività è obbligatorio');
      }
      if (!profileData.citta.trim()) {
        throw new Error('La città è obbligatoria');
      }

      const payload = {
        clerk_id: user?.id,
        tipo_provider: profileData.tipo_provider,
        nome_attivita: profileData.nome_attivita,
        citta: profileData.citta,
        regione: profileData.regione,
        email: user?.primaryEmailAddress?.emailAddress,
      };

      await api.post('/auth/sync', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Show profile form after signup
  if (isSignedIn && showProfileForm) {
    return (
      <div className="sign-up-page">
        <div className="auth-container">
          <div className="auth-card profile-form-card">
            <h1>Completa il tuo profilo</h1>
            <p>Raccontaci di più sulla tua attività</p>

            <form onSubmit={handleProfileSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="tipo_provider">Tipo di Provider *</label>
                <select
                  id="tipo_provider"
                  name="tipo_provider"
                  value={profileData.tipo_provider}
                  onChange={handleProfileChange}
                  required
                >
                  <option value="location">Location (Sale, Spazi, Parchi)</option>
                  <option value="animazione">Animazione (Intrattenitori, Maghi, etc)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="nome_attivita">Nome Attività *</label>
                <input
                  type="text"
                  id="nome_attivita"
                  name="nome_attivita"
                  value={profileData.nome_attivita}
                  onChange={handleProfileChange}
                  placeholder="Es. Sala Feste Aurora"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="citta">Città *</label>
                  <input
                    type="text"
                    id="citta"
                    name="citta"
                    value={profileData.citta}
                    onChange={handleProfileChange}
                    placeholder="Milano"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="regione">Regione</label>
                  <input
                    type="text"
                    id="regione"
                    name="regione"
                    value={profileData.regione}
                    onChange={handleProfileChange}
                    placeholder="Lombardia"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Salvataggio in corso...' : 'Completa Registrazione'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sign-up-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Registrati a FestaDeiPiccoli</h1>
          <p>Crea il tuo account per iniziare a offrire i tuoi servizi</p>

          {!isSignedIn ? (
            <>
              <SignUp
                fallbackRedirectUrl="/registrazione"
                signInUrl="/accedi"
                routing="path"
                path="/registrazione"
              />
              <div className="auth-footer">
                <p>Hai già un account? <a href="/accedi">Accedi qui</a></p>
              </div>
            </>
          ) : (
            <div className="signup-success">
              <div className="success-icon">✓</div>
              <p>Benvenuto su FestaDeiPiccoli!</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowProfileForm(true)}
              >
                Completa il Profilo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
