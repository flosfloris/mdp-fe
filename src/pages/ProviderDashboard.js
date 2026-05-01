import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MessageCircle, BarChart3 } from 'lucide-react';
import api from '../api';
import './ProviderDashboard.css';

function ProviderDashboard() {
  const [stats, setStats] = useState({
    totalServizi: 0,
    totalMessaggi: 0,
    messaggiNonLetti: 0,
  });
  const [servizi, setServizi] = useState([]);
  const [messaggi, setMessaggi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Load stats
        const statsRes = await api.get('/provider/stats');
        setStats(statsRes.data);

        // Load services
        const serviziRes = await api.get('/provider/servizi');
        setServizi(serviziRes.data);

        // Load recent messages
        const messaggiRes = await api.get('/provider/messaggi?limit=5');
        setMessaggi(messaggiRes.data);
      } catch (err) {
        setError('Errore nel caricamento del dashboard');
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleDeleteServizio = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo servizio?')) {
      return;
    }

    setDeleting(id);
    try {
      await api.delete(`/servizi/${id}`);
      setServizi(servizi.filter((s) => s.id !== id));
      setStats((prev) => ({
        ...prev,
        totalServizi: prev.totalServizi - 1,
      }));
    } catch (err) {
      alert('Errore nell\'eliminazione del servizio');
      console.error('Error deleting service:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page loading">
        <div className="spinner" />
        Caricamento dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard Provider</h1>
          <Link to="/dashboard/nuovo-servizio" className="btn btn-primary">
            <Plus size={20} />
            Aggiungi Servizio
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalServizi}</div>
              <div className="stat-label">Servizi Pubblicati</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <MessageCircle size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalMessaggi}</div>
              <div className="stat-label">Messaggi Totali</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <MessageCircle size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.messaggiNonLetti}</div>
              <div className="stat-label">Messaggi Non Letti</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Services Section */}
          <section className="dashboard-section services-section">
            <div className="section-header">
              <h2>I Miei Servizi</h2>
              <span className="service-count">{servizi.length}</span>
            </div>

            {servizi.length > 0 ? (
              <div className="services-list">
                {servizi.map((servizio) => (
                  <div key={servizio.id} className="service-item">
                    <div className="service-image">
                      <img
                        src={
                          servizio.foto_principali?.[0]?.url ||
                          'https://via.placeholder.com/100'
                        }
                        alt={servizio.titolo}
                      />
                      <span className={`service-type ${servizio.tipo}`}>
                        {servizio.tipo === 'location' ? 'Location' : 'Animazione'}
                      </span>
                    </div>
                    <div className="service-details">
                      <h3>{servizio.titolo}</h3>
                      <p className="service-city">{servizio.citta}</p>
                      <p className="service-price">
                        €{servizio.prezzo_indicativo} - €{servizio.prezzo_max}
                      </p>
                    </div>
                    <div className="service-actions">
                      <Link
                        to={`/dashboard/servizio/${servizio.id}/modifica`}
                        className="btn-action edit"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDeleteServizio(servizio.id)}
                        disabled={deleting === servizio.id}
                        title="Elimina"
                      >
                        {deleting === servizio.id ? (
                          <span className="spinner-small" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Non hai ancora pubblicato servizi.</p>
                <Link to="/dashboard/nuovo-servizio" className="btn btn-primary">
                  <Plus size={18} />
                  Pubblica il tuo primo servizio
                </Link>
              </div>
            )}
          </section>

          {/* Recent Messages Section */}
          <section className="dashboard-section messages-section">
            <div className="section-header">
              <h2>Messaggi Recenti</h2>
              <Link to="/dashboard/messaggi" className="view-all">
                Visualizza Tutti
              </Link>
            </div>

            {messaggi.length > 0 ? (
              <div className="messages-list">
                {messaggi.map((msg) => (
                  <div key={msg.id} className="message-item">
                    <div className="message-header">
                      <strong>{msg.nome}</strong>
                      {!msg.letto && <span className="unread-badge">Non letto</span>}
                    </div>
                    <p className="message-text">{msg.messaggio.substring(0, 100)}...</p>
                    <p className="message-time">
                      {new Date(msg.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Non hai ancora ricevuto messaggi.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
