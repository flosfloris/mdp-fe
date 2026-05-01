import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle } from 'lucide-react';
import api from '../api';
import './ModificaServizio.css';

function ModificaServizio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState([]);
  const [formData, setFormData] = useState({
    titolo: '',
    tipo: 'location',
    descrizione: '',
    prezzo_indicativo: '',
    prezzo_max: '',
    capienza_max: '',
    durata_minuti: '',
    eta_minima: '',
    eta_massima: '',
    indoor_outdoor: 'indoor',
    citta: '',
    indirizzo: '',
  });
  const [existingFoto, setExistingFoto] = useState([]);
  const [newFoto, setNewFoto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServizio = async () => {
      try {
        const res = await api.get(`/servizi/${id}`);
        const servizio = res.data;

        setFormData({
          titolo: servizio.titolo,
          tipo: servizio.tipo,
          descrizione: servizio.descrizione,
          prezzo_indicativo: servizio.prezzo_indicativo,
          prezzo_max: servizio.prezzo_max,
          capienza_max: servizio.capienza_max || '',
          durata_minuti: servizio.durata_minuti || '',
          eta_minima: servizio.eta_minima || '',
          eta_massima: servizio.eta_massima || '',
          indoor_outdoor: servizio.indoor_outdoor,
          citta: servizio.citta,
          indirizzo: servizio.indirizzo || '',
        });

        setSelectedCategorie(servizio.tags || []);
        setExistingFoto(servizio.foto_principali || []);

        // Load categories
        const catRes = await api.get(`/categorie?tipo=${servizio.tipo}`);
        setCategorie(catRes.data);
      } catch (err) {
        setError('Errore nel caricamento del servizio');
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };

    loadServizio();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoriaToggle = (catId) => {
    setSelectedCategorie((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleNewFotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFoto((prev) => [...prev, ...newPhotos]);
  };

  const removeExistingFoto = (id) => {
    setExistingFoto((prev) => prev.filter((f) => f.id !== id));
  };

  const removeNewFoto = (idx) => {
    setNewFoto((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      URL.revokeObjectURL(prev[idx].preview);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.titolo.trim()) {
        throw new Error('Il titolo è obbligatorio');
      }
      if (!formData.descrizione.trim()) {
        throw new Error('La descrizione è obbligatoria');
      }

      const data = new FormData();
      data.append('titolo', formData.titolo);
      data.append('descrizione', formData.descrizione);
      data.append('prezzo_indicativo', formData.prezzo_indicativo);
      data.append('prezzo_max', formData.prezzo_max);
      if (formData.tipo === 'location' && formData.capienza_max) {
        data.append('capienza_max', formData.capienza_max);
      }
      if (formData.tipo === 'animazione' && formData.durata_minuti) {
        data.append('durata_minuti', formData.durata_minuti);
      }
      data.append('eta_minima', formData.eta_minima);
      data.append('eta_massima', formData.eta_massima);
      data.append('indoor_outdoor', formData.indoor_outdoor);
      data.append('citta', formData.citta);
      data.append('indirizzo', formData.indirizzo);
      data.append('tags', JSON.stringify(selectedCategorie));

      // Keep existing photos IDs
      data.append('existing_foto_ids', JSON.stringify(existingFoto.map((f) => f.id)));

      // Add new photos
      newFoto.forEach((f) => {
        data.append('foto', f.file);
      });

      await api.put(`/servizi/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard', { state: { success: 'Servizio aggiornato con successo!' } });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="modifica-page loading">
        <div className="spinner" />
        Caricamento...
      </div>
    );
  }

  if (error && !formData.titolo) {
    return (
      <div className="modifica-page error">
        <div className="error-container">
          <AlertCircle size={48} />
          <h2>Errore</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modifica-servizio-page">
      <div className="form-container">
        <h1>Modifica Servizio</h1>

        <form onSubmit={handleSubmit} className="servizio-form">
          {error && <div className="error-message">{error}</div>}

          {/* Basic Info */}
          <fieldset>
            <legend>Informazioni di Base</legend>

            <div className="form-group">
              <label htmlFor="titolo">Titolo *</label>
              <input
                type="text"
                id="titolo"
                name="titolo"
                value={formData.titolo}
                onChange={handleChange}
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
                  value={formData.citta}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="indirizzo">Indirizzo</label>
                <input
                  type="text"
                  id="indirizzo"
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descrizione">Descrizione *</label>
              <textarea
                id="descrizione"
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>
          </fieldset>

          {/* Pricing */}
          <fieldset>
            <legend>Prezzi</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prezzo_indicativo">Prezzo Indicativo (€) *</label>
                <input
                  type="number"
                  id="prezzo_indicativo"
                  name="prezzo_indicativo"
                  value={formData.prezzo_indicativo}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prezzo_max">Prezzo Massimo (€) *</label>
                <input
                  type="number"
                  id="prezzo_max"
                  name="prezzo_max"
                  value={formData.prezzo_max}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Details */}
          <fieldset>
            <legend>Dettagli</legend>

            {formData.tipo === 'location' && (
              <div className="form-group">
                <label htmlFor="capienza_max">Capienza Massima (persone)</label>
                <input
                  type="number"
                  id="capienza_max"
                  name="capienza_max"
                  value={formData.capienza_max}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}

            {formData.tipo === 'animazione' && (
              <div className="form-group">
                <label htmlFor="durata_minuti">Durata (minuti)</label>
                <input
                  type="number"
                  id="durata_minuti"
                  name="durata_minuti"
                  value={formData.durata_minuti}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eta_minima">Età Minima (anni)</label>
                <input
                  type="number"
                  id="eta_minima"
                  name="eta_minima"
                  value={formData.eta_minima}
                  onChange={handleChange}
                  min="0"
                  max="18"
                />
              </div>

              <div className="form-group">
                <label htmlFor="eta_massima">Età Massima (anni)</label>
                <input
                  type="number"
                  id="eta_massima"
                  name="eta_massima"
                  value={formData.eta_massima}
                  onChange={handleChange}
                  min="0"
                  max="18"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="indoor_outdoor">Ubicazione</label>
              <select
                id="indoor_outdoor"
                name="indoor_outdoor"
                value={formData.indoor_outdoor}
                onChange={handleChange}
              >
                <option value="indoor">Al chiuso</option>
                <option value="outdoor">All'aperto</option>
                <option value="both">Entrambi</option>
              </select>
            </div>
          </fieldset>

          {/* Categories */}
          {categorie.length > 0 && (
            <fieldset>
              <legend>Categorie</legend>
              <div className="checkbox-group">
                {categorie.map((cat) => (
                  <label key={cat.id}>
                    <input
                      type="checkbox"
                      checked={selectedCategorie.includes(cat.id)}
                      onChange={() => handleCategoriaToggle(cat.id)}
                    />
                    {cat.nome}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* Photos */}
          <fieldset>
            <legend>Foto</legend>

            {existingFoto.length > 0 && (
              <div>
                <h3>Foto Attuali</h3>
                <div className="preview-grid">
                  {existingFoto.map((f) => (
                    <div key={f.id} className="preview-item">
                      <img src={f.url} alt="Existing" />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeExistingFoto(f.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="upload-area">
              <input
                type="file"
                id="foto"
                multiple
                accept="image/*"
                onChange={handleNewFotoChange}
              />
              <label htmlFor="foto" className="upload-label">
                <Upload size={32} />
                <p>Aggiungi altre foto</p>
                <span>JPG, PNG fino a 5 MB</span>
              </label>
            </div>

            {newFoto.length > 0 && (
              <div className="foto-preview">
                <h3>Nuove Foto ({newFoto.length})</h3>
                <div className="preview-grid">
                  {newFoto.map((f, idx) => (
                    <div key={idx} className="preview-item">
                      <img src={f.preview} alt={`New ${idx}`} />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeNewFoto(idx)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </fieldset>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Salvataggio in corso...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModificaServizio;
