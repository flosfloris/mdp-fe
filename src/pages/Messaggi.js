import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';
import './Messaggi.css';

function Messaggi() {
  const [messaggi, setMessaggi] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingId, setReplyingId] = useState(null);
  const [replyStatus, setReplyStatus] = useState('idle');

  useEffect(() => {
    loadMessaggi();
  }, []);

  const loadMessaggi = async () => {
    try {
      const res = await api.get('/provider/messaggi');
      setMessaggi(res.data);
    } catch (err) {
      setError('Errore nel caricamento dei messaggi');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMessageDetail = async (msg) => {
    if (selectedMsg?.id === msg.id) {
      setSelectedMsg(null);
    } else {
      setSelectedMsg(msg);
      // Mark as read
      if (!msg.letto) {
        try {
          await api.patch(`/messaggi/${msg.id}/leggi`);
          setMessaggi((prev) =>
            prev.map((m) =>
              m.id === msg.id ? { ...m, letto: true } : m
            )
          );
        } catch (err) {
          console.error('Error marking message as read:', err);
        }
      }
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMsg) return;

    setReplyStatus('loading');
    try {
      await api.post(`/messaggi/${selectedMsg.id}/risposta`, {
        messaggio: replyText,
      });

      setReplyText('');
      setReplyStatus('success');

      // Reload messages
      await loadMessaggi();
      setSelectedMsg(null);

      setTimeout(() => setReplyStatus('idle'), 3000);
    } catch (err) {
      setReplyStatus('error');
      console.error('Error sending reply:', err);
    }
  };

  const unreadCount = messaggi.filter((m) => !m.letto).length;

  if (loading) {
    return (
      <div className="messaggi-page loading">
        <div className="spinner" />
        Caricamento messaggi...
      </div>
    );
  }

  return (
    <div className="messaggi-page">
      <div className="messaggi-container">
        {/* Header */}
        <div className="messaggi-header">
          <div>
            <h1>
              <MessageCircle size={32} />
              Messaggi
            </h1>
            {unreadCount > 0 && (
              <p className="unread-info">{unreadCount} messaggi non letti</p>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="messaggi-content">
          {/* Messages List */}
          <div className="messaggi-list">
            {messaggi.length > 0 ? (
              messaggi.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-item ${!msg.letto ? 'unread' : ''} ${
                    selectedMsg?.id === msg.id ? 'selected' : ''
                  }`}
                  onClick={() => toggleMessageDetail(msg)}
                >
                  <div className="message-item-header">
                    <div className="message-sender">
                      <strong>{msg.nome}</strong>
                      {!msg.letto && <span className="unread-dot" />}
                    </div>
                    <span className="message-date">
                      {new Date(msg.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <div className="message-item-body">
                    <p className="message-subject">{msg.oggetto}</p>
                    <p className="message-preview">
                      {msg.messaggio.substring(0, 80)}
                      {msg.messaggio.length > 80 ? '...' : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>Nessun messaggio</p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selectedMsg && (
            <div className="message-detail">
              <div className="detail-header">
                <div>
                  <h3>{selectedMsg.nome}</h3>
                  <p className="detail-date">
                    {new Date(selectedMsg.created_at).toLocaleDateString('it-IT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="detail-body">
                <p className="detail-subject">
                  <strong>Oggetto:</strong> {selectedMsg.oggetto}
                </p>

                {selectedMsg.email && (
                  <p className="detail-email">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${selectedMsg.email}`}>{selectedMsg.email}</a>
                  </p>
                )}

                {selectedMsg.telefono && (
                  <p className="detail-phone">
                    <strong>Telefono:</strong>{' '}
                    <a href={`tel:${selectedMsg.telefono}`}>{selectedMsg.telefono}</a>
                  </p>
                )}

                <div className="detail-message">
                  <p>{selectedMsg.messaggio}</p>
                </div>

                {selectedMsg.servizio && (
                  <div className="detail-service">
                    <strong>Servizio:</strong> {selectedMsg.servizio.titolo}
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Scrivi la tua risposta..."
                  rows="4"
                />

                {replyStatus === 'success' && (
                  <div className="status-message success">
                    <CheckCircle size={18} />
                    <span>Risposta inviata con successo!</span>
                  </div>
                )}

                {replyStatus === 'error' && (
                  <div className="status-message error">
                    <AlertCircle size={18} />
                    <span>Errore nell'invio della risposta</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-reply"
                  disabled={!replyText.trim() || replyStatus === 'loading'}
                >
                  {replyStatus === 'loading' ? (
                    <>
                      <span className="spinner-small" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Invia Risposta
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messaggi;
