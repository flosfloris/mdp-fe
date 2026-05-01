import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Zap, ArrowRight, Cake } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Trova la location o l'animazione perfetta per la festa del tuo bambino
          </h1>
          <p className="hero-subtitle">
            Scopri i migliori provider di location e animazione in tutta Italia. Organizza feste indimenticabili!
          </p>
          <div className="hero-cta">
            <Link to="/cerca?tipo=location" className="btn btn-primary">
              <MapPin size={20} />
              Cerca Location
            </Link>
            <Link to="/cerca?tipo=animazione" className="btn btn-secondary">
              <Zap size={20} />
              Cerca Animazione
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <Cake size={120} color="#FF6B9D" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">Come Funziona</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Cerca</h3>
              <p>Visualizza i migliori provider di location e animazione nella tua città.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Confronta</h3>
              <p>Leggi le recensioni, guarda le foto e confronta i prezzi.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Contatta</h3>
              <p>Invia un messaggio diretto e prenota la festa perfetta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <div className="section-container">
          <h2 className="section-title">Categorie Principali</h2>
          <div className="categories-grid">
            <Link to="/cerca?tipo=location" className="category-card">
              <div className="category-icon location">
                <MapPin size={40} />
              </div>
              <h3>Location per Feste</h3>
              <p>Sale, parchi, fattorie e spazi innovativi per celebrare il compleanno</p>
              <span className="explore-link">Esplora <ArrowRight size={16} /></span>
            </Link>

            <Link to="/cerca?tipo=animazione" className="category-card">
              <div className="category-icon animation">
                <Zap size={40} />
              </div>
              <h3>Animatori Professionisti</h3>
              <p>Maghi, giocolieri, intrattenitori e artisti per animare la festa</p>
              <span className="explore-link">Esplora <ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="provider-cta">
        <div className="cta-content">
          <h2>Sei un organizzatore di feste?</h2>
          <p>Unisciti alla community di FestaDeiPiccoli e raggiungi migliaia di genitori alla ricerca dei tuoi servizi!</p>
          <Link to="/registrazione" className="btn btn-large">
            Diventa Provider
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <p>Location e Animatori</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">10000+</div>
              <p>Feste Organizzate</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">50000+</div>
              <p>Bambini Felici</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <p>Regioni Coperte</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
