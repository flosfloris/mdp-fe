import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">FestaDeiPiccoli</h3>
          <p className="footer-description">
            La piattaforma più completa per trovare location e animatori per le feste di compleanno dei tuoi bambini in Italia.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Link Utili</h4>
          <ul className="footer-links">
            <li>
              <Link to="/cerca?tipo=location">Cerca Location</Link>
            </li>
            <li>
              <Link to="/cerca?tipo=animazione">Cerca Animazione</Link>
            </li>
            <li>
              <Link to="/registrazione">Diventa Provider</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contatti</h4>
          <div className="contact-item">
            <Mail size={16} />
            <a href="mailto:info@festadeipiccoli.it">info@festadeipiccoli.it</a>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <a href="tel:+39123456789">+39 123 456 789</a>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <span>Milano, Italia</span>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Comunità</h4>
          <p className="footer-brand">
            Parte della famiglia <strong>MilanoDaPiccoli</strong>
          </p>
          <p className="footer-tagline">
            Creiamo ricordi indimenticabili per i bambini
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 FestaDeiPiccoli. Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}

export default Footer;
