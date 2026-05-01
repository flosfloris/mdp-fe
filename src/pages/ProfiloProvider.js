import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Phone, AlertCircle } from 'lucide-react';
import api from '../api';
import ServiceCard from '../components/ServiceCard';
import ContactForm from '../components/ContactForm';
import './ProfiloProvider.css';

function ProfiloProvider() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [servizi, setServizi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const res = await api.get(`/provider/${id}`);
        setProvider(res.data);

        const serviziRes = await api.get(`/servizi?provider_id=${id}`);
        setServizi(serviziRes.data.servizi || []);
      } catch (err) {
        setError('Provider non trovato');
        console.error('Error loading provider:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="profilo-page loading">
        <div className="spinner" />
        Caricamento...
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="profilo-page error">
        <div className="error-container">
          <AlertCircle size={48} />
          <h2>{error || 'Provider non trovato'}</h2>
          <p>Torna alla ricerca per trovare altri provider</p>
          <Link to="/cerca" className="btn btn-primary">
            Torna alla Ricerca
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profilo-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to="/cerca">Ricerca</Link>
        <span> / </span>
        <span>{provider.nome_attivita}</span>
      </div>

      {/* Provider Header */}
      <div className="provider-header-section">
        <div className="header-content">
          <div className="header-avatar">
            <img
              src={provider.avatar_url || 'https://via.placeholder.com/120'}
              alt={provider.nome_attivita}
              className="avatar"
            />
          </div>
          <div className="header-info">
            <h1>{provider.nome_attivita}</h1>
            {provider.descrizione_attivita && (
              <p className="description">{provider.descrizione_attivita}</p>
            )}
            <div className="location-info">
              <MapPin size={18} />
              <span>
                {provider.citta}, {provider.regione}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profilo-container">
        {/* Main Content */}
        <div className="profilo-main">
          {/* Services Section */}
          <section className="services-section">
            <h2>I nostri servizi ({servizi.length})</h2>
            {servizi.length > 0 ? (
              <div className="services-grid">
                {servizi.map((servizio) => (
                  <ServiceCard key={servizio.id} servizio={servizio} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Questo provider non ha ancora pubblicato servizi.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="profilo-sidebar">
          {/* Contact Info */}
          <div className="contact-info-card">
            <h3>Contatti</h3>
            {provider.email && (
              <div className="contact-item">
                <Mail size={18} />
                <a href={`mailto:${provider.email}`}>{provider.email}</a>
              </div>
            )}
            {provider.telefono && (
              <div className="contact-item">
                <Phone size={18} />
                <a href={`tel:${provider.telefono}`}>{provider.telefono}</a>
              </div>
            )}
            {provider.citta && (
              <div className="contact-item">
                <MapPin size={18} />
                <span>
                  {provider.citta}, {provider.regione}
                </span>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <ContactForm
            providerId={provider.id}
            providerName={provider.nome_attivita}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfiloProvider;
