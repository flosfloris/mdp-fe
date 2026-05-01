import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';
import './ServiceCard.css';

function ServiceCard({ servizio }) {
  const imageUrl = servizio.foto_principali?.[0]?.url || 'https://via.placeholder.com/300x200?text=Location';
  const badgeColor = servizio.tipo === 'location' ? 'location' : 'animazione';

  return (
    <Link to={`/servizio/${servizio.id}`} className="service-card-link">
      <div className="service-card">
        {/* Image */}
        <div className="card-image-container">
          <img
            src={imageUrl}
            alt={servizio.titolo}
            className="card-image"
          />
          <div className={`card-badge badge-${badgeColor}`}>
            {servizio.tipo === 'location' ? 'Location' : 'Animazione'}
          </div>
        </div>

        {/* Content */}
        <div className="card-content">
          <h3 className="card-title">{servizio.titolo}</h3>

          {/* Location info */}
          <div className="card-location">
            <MapPin size={14} />
            <span>{servizio.citta}</span>
          </div>

          {/* Price range */}
          <div className="card-price">
            €{servizio.prezzo_indicativo} - €{servizio.prezzo_max}
          </div>

          {/* Details row */}
          <div className="card-details">
            {servizio.tipo === 'location' && servizio.capienza_max && (
              <div className="detail-item">
                <Users size={14} />
                <span>{servizio.capienza_max} persone</span>
              </div>
            )}
            {servizio.tipo === 'animazione' && servizio.durata_minuti && (
              <div className="detail-item">
                <Clock size={14} />
                <span>{servizio.durata_minuti} min</span>
              </div>
            )}
          </div>

          {/* Indoor/Outdoor badge */}
          {servizio.indoor_outdoor && (
            <div className="card-meta">
              <span className="meta-badge">
                {servizio.indoor_outdoor === 'indoor' ? 'Al chiuso' : servizio.indoor_outdoor === 'outdoor' ? 'All\'aperto' : 'Entrambi'}
              </span>
            </div>
          )}

          {/* Provider name */}
          <div className="card-provider">
            {servizio.provider?.nome_attivita || 'Provider'}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCard;
