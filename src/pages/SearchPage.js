import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import api from '../api';
import ServiceCard from '../components/ServiceCard';
import './SearchPage.css';

const REGIONI = [
  'Piemonte', 'Valle d\'Aosta', 'Lombardia', 'Trentino-Alto Adige', 'Veneto',
  'Friuli-Venezia Giulia', 'Liguria', 'Emilia-Romagna', 'Toscana', 'Umbria',
  'Marche', 'Lazio', 'Abruzzo', 'Molise', 'Campania', 'Puglia', 'Basilicata',
  'Calabria', 'Sicilia', 'Sardegna'
];

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'location');
  const [regione, setRegione] = useState(searchParams.get('regione') || '');
  const [citta, setCitta] = useState(searchParams.get('citta') || '');
  const [prezzoMin, setPrezzoMin] = useState(searchParams.get('prezzoMin') || 0);
  const [prezzoMax, setPrezzoMax] = useState(searchParams.get('prezzoMax') || 1000);
  const [etaMin, setEtaMin] = useState(searchParams.get('etaMin') || '');
  const [etaMax, setEtaMax] = useState(searchParams.get('etaMax') || '');
  const [indoorOutdoor, setIndoorOutdoor] = useState(searchParams.get('indoorOutdoor') || '');
  const [categorie, setCategorie] = useState(searchParams.get('categorie')?.split(',') || []);
  const [sorting, setSorting] = useState(searchParams.get('sort') || 'recent');

  // Data state
  const [servizi, setServizi] = useState([]);
  const [allCategorie, setAllCategorie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const itemsPerPage = 12;

  // Load categories on mount or when tipo changes
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get(`/categorie?tipo=${tipo}`);
        setAllCategorie(res.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, [tipo]);

  // Load services with current filters
  useEffect(() => {
    const loadServizi = async () => {
      setLoading(true);
      try {
        const params = {
          tipo,
          regione: regione || undefined,
          citta: citta || undefined,
          prezzo_min: prezzoMin,
          prezzo_max: prezzoMax,
          eta_min: etaMin || undefined,
          eta_max: etaMax || undefined,
          indoor_outdoor: indoorOutdoor || undefined,
          categorie: categorie.length > 0 ? categorie.join(',') : undefined,
          sort: sorting,
          page: currentPage,
          limit: itemsPerPage,
        };

        const res = await api.get('/servizi', { params });
        setServizi(res.data.servizi || []);
        setTotalResults(res.data.total || 0);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServizi();
  }, [tipo, regione, citta, prezzoMin, prezzoMax, etaMin, etaMax, indoorOutdoor, categorie, sorting, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tipo', tipo);
    if (regione) params.set('regione', regione);
    if (citta) params.set('citta', citta);
    if (prezzoMin) params.set('prezzoMin', prezzoMin);
    if (prezzoMax) params.set('prezzoMax', prezzoMax);
    if (etaMin) params.set('etaMin', etaMin);
    if (etaMax) params.set('etaMax', etaMax);
    if (indoorOutdoor) params.set('indoorOutdoor', indoorOutdoor);
    if (categorie.length > 0) params.set('categorie', categorie.join(','));
    if (sorting) params.set('sort', sorting);

    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [tipo, regione, citta, prezzoMin, prezzoMax, etaMin, etaMax, indoorOutdoor, categorie, sorting, setSearchParams]);

  const toggleCategoria = (cat) => {
    setCategorie((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="search-page">
      {/* Filter Toggle Button (Mobile) */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={20} />
        Filtri
      </button>

      <div className="search-container">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filtri</h3>
            <button
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Tipo Filter */}
          <div className="filter-group">
            <h4>Tipo di Servizio</h4>
            <div className="tipo-tabs">
              <button
                className={`tipo-tab ${tipo === 'location' ? 'active' : ''}`}
                onClick={() => setTipo('location')}
              >
                Location
              </button>
              <button
                className={`tipo-tab ${tipo === 'animazione' ? 'active' : ''}`}
                onClick={() => setTipo('animazione')}
              >
                Animazione
              </button>
            </div>
          </div>

          {/* Regione */}
          <div className="filter-group">
            <label htmlFor="regione">Regione</label>
            <select
              id="regione"
              value={regione}
              onChange={(e) => setRegione(e.target.value)}
            >
              <option value="">Tutte le regioni</option>
              {REGIONI.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Città */}
          <div className="filter-group">
            <label htmlFor="citta">Città</label>
            <input
              type="text"
              id="citta"
              placeholder="Cerca città..."
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
            />
          </div>

          {/* Prezzo */}
          <div className="filter-group">
            <label>Prezzo (€)</label>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={prezzoMin}
                onChange={(e) => setPrezzoMin(e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={prezzoMax}
                onChange={(e) => setPrezzoMax(e.target.value)}
              />
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              value={prezzoMax}
              onChange={(e) => setPrezzoMax(e.target.value)}
              className="price-slider"
            />
          </div>

          {/* Età */}
          <div className="filter-group">
            <label>Età del Bambino</label>
            <div className="age-inputs">
              <input
                type="number"
                min="0"
                max="18"
                placeholder="Da"
                value={etaMin}
                onChange={(e) => setEtaMin(e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                max="18"
                placeholder="A"
                value={etaMax}
                onChange={(e) => setEtaMax(e.target.value)}
              />
            </div>
          </div>

          {/* Indoor/Outdoor */}
          <div className="filter-group">
            <label>Ubicazione</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="indoor_outdoor"
                  value=""
                  checked={indoorOutdoor === ''}
                  onChange={(e) => setIndoorOutdoor(e.target.value)}
                />
                Tutte
              </label>
              <label>
                <input
                  type="radio"
                  name="indoor_outdoor"
                  value="indoor"
                  checked={indoorOutdoor === 'indoor'}
                  onChange={(e) => setIndoorOutdoor(e.target.value)}
                />
                Al chiuso
              </label>
              <label>
                <input
                  type="radio"
                  name="indoor_outdoor"
                  value="outdoor"
                  checked={indoorOutdoor === 'outdoor'}
                  onChange={(e) => setIndoorOutdoor(e.target.value)}
                />
                All'aperto
              </label>
            </div>
          </div>

          {/* Categories */}
          {allCategorie.length > 0 && (
            <div className="filter-group">
              <label>Categorie</label>
              <div className="checkbox-group">
                {allCategorie.map((cat) => (
                  <label key={cat.id}>
                    <input
                      type="checkbox"
                      checked={categorie.includes(cat.id)}
                      onChange={() => toggleCategoria(cat.id)}
                    />
                    {cat.nome}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="search-results">
          {/* Header with sorting */}
          <div className="results-header">
            <h2>
              {totalResults} risultati {tipo === 'location' ? 'Location' : 'Animatori'}
            </h2>
            <div className="sort-control">
              <label htmlFor="sort">Ordina per:</label>
              <select
                id="sort"
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
              >
                <option value="recent">Più recenti</option>
                <option value="price_asc">Prezzo crescente</option>
                <option value="price_desc">Prezzo decrescente</option>
                <option value="rating">Migliori valutazioni</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              Caricamento risultati...
            </div>
          )}

          {/* Results Grid */}
          {!loading && servizi.length > 0 && (
            <>
              <div className="services-grid">
                {servizi.map((servizio) => (
                  <ServiceCard key={servizio.id} servizio={servizio} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Precedente
                  </button>
                  <div className="page-info">
                    Pagina {currentPage} di {totalPages}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Successiva
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && servizi.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nessun risultato trovato</h3>
              <p>
                Prova a modificare i filtri per trovare i servizi che cerchi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
