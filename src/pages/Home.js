import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, ArrowRight, Search } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Trova la festa perfetta per i tuoi bambini</h1>
          <p className="hero-subtitle">Divertimento assicurato!</p>
          <div className="hero-search">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cerca location o animatori..."
                className="search-input"
              />
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">🎉</div>
        </div>
      </section>

      {/* Come Funziona Section */}
      <section className="come-funziona">
        <div className="section-container">
          <h2 className="section-title">Come funziona?</h2>
          <div className="icons-row">
            <div className="icon-card">
              <div className="icon-circle location">
                <MapPin size={32} />
              </div>
              <h4>Location</h4>
            </div>
            <div className="icon-card">
              <div className="icon-circle animation">
                <Zap size={32} />
              </div>
              <h4>Animazione</h4>
            </div>
            <div className="icon-card">
              <div className="icon-circle catering">
                <span>🍰</span>
              </div>
              <h4>Catering</h4>
            </div>
            <div className="icon-card">
              <div className="icon-circle decoration">
                <span>🎈</span>
              </div>
              <h4>Decorazioni</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Le migliori location */}
      <section className="best-locations">
        <div className="section-container">
          <h2 className="section-title">Le migliori location</h2>
          <div className="cards-grid">
            <Link to="/cerca?tipo=location" className="venue-card">
              <div className="venue-image">
                <div className="placeholder-img">📍</div>
              </div>
              <div className="venue-info">
                <h3>Villa Elegante</h3>
                <p>Roma</p>
              </div>
            </Link>
            <Link to="/cerca?tipo=location" className="venue-card">
              <div className="venue-image">
                <div className="placeholder-img">🏢</div>
              </div>
              <div className="venue-info">
                <h3>Spazio Creativo</h3>
                <p>Milano</p>
              </div>
            </Link>
            <Link to="/cerca?tipo=location" className="venue-card">
              <div className="venue-image">
                <div className="placeholder-img">🎪</div>
              </div>
              <div className="venue-info">
                <h3>Parco Divertimenti</h3>
                <p>Napoli</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* I migliori animatori */}
      <section className="best-animators">
        <div className="section-container">
          <h2 className="section-title">I migliori animatori</h2>
          <div className="cards-grid">
            <Link to="/cerca?tipo=animazione" className="animator-card">
              <div className="animator-image">
                <div className="placeholder-img">🎭</div>
              </div>
              <div className="animator-info">
                <h3>Maghi & Magia</h3>
                <p>Spettacoli interattivi</p>
              </div>
            </Link>
            <Link to="/cerca?tipo=animazione" className="animator-card">
              <div className="animator-image">
                <div className="placeholder-img">🤹</div>
              </div>
              <div className="animator-info">
                <h3>Giocolieri Professionisti</h3>
                <p>Acrobazie e divertimento</p>
              </div>
            </Link>
            <Link to="/cerca?tipo=animazione" className="animator-card">
              <div className="animator-image">
                <div className="placeholder-img">🎪</div>
              </div>
              <div className="animator-info">
                <h3>Intrattenitori Vari</h3>
                <p>Musica e danza</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional CTA Banner */}
      <section className="professional-cta">
        <div className="cta-wrapper">
          <div className="cta-text">
            <h2>Sei un professionista? Unisciti a noi!</h2>
            <p>Raggiungi migliaia di genitori alla ricerca dei tuoi servizi</p>
            <Link to="/registrazione" className="btn btn-cta">
              Diventa Provider
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="cta-image">
            <div className="placeholder-img-large">👨‍💼</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <p>Provider</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <p>Feste Organizzate</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <p>Bambini Felici</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <p>Regioni</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
