import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './restaurantInformation.css';

function RestaurantInformation({ restaurants }) {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  // Trouver le restaurant correspondant à l'ID
  const restaurant = restaurants.find((r) => r.id === parseInt(restaurantId));

  if (!restaurant) {
    return (
      <div className="not-found">
        <h2>Restaurant non trouvé</h2>
        <button onClick={() => navigate(` /login/homeManager/restaurantManagement/${restaurantId}`)} className="back-button">
          Retour à la liste
        </button>
      </div>
    );
  }

  // Construire l'URL complète de la photo si nécessaire
  const getPhotoUrl = () => {
    if (!restaurant.photo) return null;
    
    // Si c'est déjà une URL complète
    if (restaurant.photo.startsWith('http')) return restaurant.photo;
    
    // Si c'est un chemin relatif, ajoutez l'URL de base de votre API
    return `https://votre-api.com/${restaurant.photo}`;
  };

  const photoUrl = getPhotoUrl();

  // Formatage des données pour affichage
  const restaurantDetails = [
    { label: 'ID', value: restaurant.id },
    { label: 'Nom', value: restaurant.name },
    { label: 'Nombre de tables', value: restaurant.tableNumber },
    { label: 'Téléphone', value: restaurant.phone },
    { label: 'Adresse', value: restaurant.address },
    { 
      label: 'Lien Google Maps', 
      value: restaurant.mapsLink ? (
        <a href={restaurant.mapsLink} target="_blank" rel="noopener noreferrer">
          Voir sur la carte
        </a>
      ) : 'Non spécifié' 
    },
    { 
      label: 'Date de création', 
      value: restaurant.creationDate || new Date().toLocaleDateString() 
    },
  ];

  return (
    <div className="restaurant-info-container">
      <div className="header-section">
        <h1>Fiche restaurant</h1>
        <div className="action-buttons">
          <button 
            onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/restaurantOption`)} 
            className="back-button"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="restaurant-profile">
        <div className="image-section">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={restaurant.name} 
              className="restaurant-image"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = ''; // Ou une image par défaut
              }}
            />
          ) : (
            <div className="image-placeholder">
              {restaurant.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2>{restaurant.name}</h2>
          <p className="restaurant-id">ID: {restaurant.id}</p>
        </div>


        <div className="details-section">
          <h3>Informations générales</h3>
          <div className="details-grid">
            {restaurantDetails.map((detail, index) => (
              <div key={index} className="detail-item">
                <span className="detail-label">{detail.label}:</span>
                <span className="detail-value">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h3>Statistiques</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{restaurant.tableNumber || '0'}</span>
              <span className="stat-label">Tables</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">N/A</span>
              <span className="stat-label">Serveurs</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">N/A</span>
              <span className="stat-label">Commandes/jour</span>
            </div>
          </div>
        </div>

        {restaurant.mapsLink && (
          <div className="map-section">
            <h3>Localisation</h3>
            <div className="map-embed">
              <iframe
                title="Restaurant Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.address)}&output=embed`}
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantInformation;