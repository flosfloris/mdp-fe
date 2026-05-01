import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';
import './ContactForm.css';

function ContactForm({ providerId, servizioId, providerName }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    oggetto: '',
    messaggio: '',
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.nome.trim()) {
      setStatus('error');
      setErrorMessage('Il nome è obbligatorio');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Inserisci un email valido');
      return;
    }

    if (!formData.messaggio.trim()) {
      setStatus('error');
      setErrorMessage('Il messaggio è obbligatorio');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const payload = {
        provider_id: providerId,
        servizio_id: servizioId || null,
        nome: formData.nome,
        email: formData.email,
        telefono: formData.telefono || null,
        oggetto: formData.oggetto || 'Richiesta di informazioni',
        messaggio: formData.messaggio,
      };

      await api.post('/messaggi', payload);

      setStatus('success');
      setFormData({
        nome: '',
        email: '',
        telefono: '',
        oggetto: '',
        messaggio: '',
      });

      // Reset success after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error.response?.data?.error || 'Errore nell\'invio del messaggio. Riprova.'
      );
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-header">
        <h3>Contatta {providerName}</h3>
        <p>Compila il form per inviare una richiesta di informazioni</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Il tuo nome"
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="La tua email"
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="telefono">Telefono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Il tuo numero (opzionale)"
          />
        </div>

        {/* Subject */}
        <div className="form-group">
          <label htmlFor="oggetto">Oggetto</label>
          <input
            type="text"
            id="oggetto"
            name="oggetto"
            value={formData.oggetto}
            onChange={handleChange}
            placeholder="Oggetto del messaggio"
          />
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="messaggio">Messaggio *</label>
          <textarea
            id="messaggio"
            name="messaggio"
            value={formData.messaggio}
            onChange={handleChange}
            placeholder="Scrivi il tuo messaggio..."
            rows="5"
            required
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="status-message success">
            <CheckCircle size={18} />
            <span>Messaggio inviato con successo!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="status-message error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="spinner" />
              Invio in corso...
            </>
          ) : (
            <>
              <Send size={18} />
              Invia Messaggio
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
