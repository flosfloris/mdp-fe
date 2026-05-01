import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Home, AlertCircle } from 'lucide-react';
import api from '../api';
import ContactForm from '../components/ContactForm';
import './DettaglioServizio.css';

function DettaglioServizio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servizio, setServizio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    const loadServizio = async () => {
      try {
        const res = await api.get(`/servizi/${id}`);
        setServizio(res.data);
      } catch (err) {
        setError('Servizio non trovato');
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };
    loadServizio();
  }, [id]);

  if (loading) {
    return (
      <div className="dettaglio-page loading">
        <div className="spinner" />
        Caricamento...
      </div>
    );
  }

  if (error || !servizio) {
    return (
      <div className="dettaglio-page error">
        <div className="error-container">
          <AlertCircle size={48} />
          <h2>{error || 'Servizio non trovato'}</h2>
          <p>Torna alla ricerca per trovare altri servizi</p>
          <Link to="/cerca" className="btn btn-primary">
            Torna alla Ricerca
          </Link>
        </div>
      </div>
    );
  }

  const foto = servizio.foto_principali || [];
  const mainFoto = foto[mainImage]?.url || 'https://via.placeholder.com/600x400?text=Location';

  return (
    <div className="dettaglio-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to="/cerca">Ricerca</Link>
        <span> / </span>
        <span>{servizio.titolo}</span>
      </div>

      <div className="dettaglio-container">
        {/* Left Column - Gallery & Details */}
        <div className="dettaglio-main">
          {/* Photo Gallery */}
          <div className="gallery-section">
            <div className="main-image">
              <img src={mainFoto} alt={servizio.titolo} />
              <div className="badge">
                {servizio.tipo === 'location' ? 'Location' : 'Animazione'}
              </div>
            </div>
            {foto.length > 1 && (
              <div className="thumbnails">
                {foto.map((f, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail ${idx === mainImage ? 'active' : ''}`}
                    onClick={() => setMainImage(idx)}
                  >
                    <img src={f.url} alt={`Foto ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Info */}
          <div className="info-section">
            <div className="header-info">
              <h1>{servizio.titolo}</h1>
              <div className="price-large">€{servizio.prezzo_indicativo} - €{servizio.prezzo_max}</div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h3>Descrizione</h3>
              <p>{servizio.descrizione}</p>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
              {servizio.tipo === 'location' && servizio.capienza_max && (
                <div className="detail-box">
                  <Users size={24} />
                  <div>
                    <strong>Capienza Massima</strong>
                    <p>{servizio.capienza_max} persone</p>
                  </div>
                </div>
              )}

              {servizio.tipo === 'animazione' && servizio.durata_minuti && (
                <div className="detail-box">
                  <Clock size={24} />
                  <div>
                    <strong>Durata</strong>
                    <p>{servizio.durata_minuti} minuti</p>
                  </div>
                </div>
              )}

              <div className="detail-box">
                <Home size={24} />
                <div>
                  <strong>Ubicazione</strong>
                  <p>
                    {servizio.indoor_outdoor === 'indoor'
                      ? 'Al chiuso'
                      : servizio.indoor_outdoor === 'outdoor'
                      ? "All'aperto"
                      : 'Entrambi'}
                  </p>
                </div>
              </div>

              <div className="detail-box">
                <MapPin size={24} />
                <div>
                  <strong>Ubicazione</strong>
                  <p>{servizio.citta}</p>
                </div>
              </div>
            </div>

            {/* Age Range */}
            {(servizio.eta_minima || servizio.eta_massima) && (
              <div className="age-section">
                <h3>Fascia d'Età Consigliata</h3>
                <p>
                  {servizio.eta_minima || '0'} - {servizio.eta_massima || '18'} anni
                </p>
              </div>
            )}

            {/* Tags */}
            {servizio.tags && servizio.tags.length > 0 && (
              <div className="tags-section">
                <h3>Categoria</h3>
                <div className="tags">
                  {servizio.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Provider & Contact */}
        <div className="dettaglio-sidebar">
          {/* Provider Card */}
          <div className="provider-card">
            <div className="provider-header">
              <img
                src={servizio.provider?.avatar_url || 'https://via.placeholder.com/80'}
                alt={servizio.provider?.nome_attivita}
                className="provider-avatar"
              />
              <div className="provider-info">
                <h3>{servizio.provider?.nome_attivita}</h3>
                <p>{servizio.provider?.citta}</p>
              </div>
            </div>

            {servizio.provider?.descrizione_attivita && (
              <div className="provider-description">
                <p>{servizio.provider.descrizione_attivita}</p>
              </div>
            )}

            <Link
              to={`/provider/${servizio.provider_id}`}
              className="btn btn-outline"
            >
              Visualizza Profilo
            </Link>
          </div>

          {/* Contact Form */}
          <ContactForm
            providerId={servizio.provider_id}
            servizioId={servizio.id}
            providerName={servizio.provider?.nome_attivita || 'Provider'}
          />
        </div>
      </div>
    </div>
  );
}

export default DettaglioServizio;
