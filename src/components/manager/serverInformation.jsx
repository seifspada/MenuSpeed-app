import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './serverInformation.css';

function ServerInformation({ servers, restaurants }) {
  const { serverId } = useParams();
  const navigate = useNavigate();

  // Trouver le server correspondant à l'ID
  const server = servers.find((m) => m.id === parseInt(serverId));

  if (!server) {
    return (
      <div className="not-found">
        <h2>Server non trouvé</h2>
        <button onClick={() => navigate('/serverOption')} className="back-button">
          Retour à la liste
        </button>
      </div>
    );
  }

  // Formatage des données pour affichage
  const serverDetails = [
    { label: 'ID', value: server.id },
    { label: 'Nom complet', value: server.name },
    { label: 'CIN', value: server.cin || 'Non spécifié' },
    { label: 'Matricule', value: server.matricule },
    { label: 'Mot de passe', value: server.password }, // Ligne ajoutée
    { label: 'Téléphone', value: server.phone },
    { label: 'Rôle', value: server.role },
    { 
      label: 'Date de création', 
      value: server.creationDate || new Date().toLocaleDateString() 
    },
  ];

  return (
    <div className="server-info-container">
      <div className="header-section">
        <h1>Fiche server</h1>
        <div className="action-buttons">
          
          <button 
            onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement/serverOption/${serverId}`)} 
            className="back-button"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="server-profile">
        <div className="avatar-section">
          <div className="avatar-placeholder">
            {server.name.charAt(0).toUpperCase()}
          </div>
          <h2>{server.name}</h2>
          <p className="server-id">ID: {server.id}</p>
        </div>

        <div className="details-section">
          <h3>Informations personnelles</h3>
          <div className="details-grid">
            {serverDetails.map((detail, index) => (
              <div key={index} className="detail-item">
                <span className="detail-label">{detail.label}:</span>
                <span className="detail-value">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="restaurants-section">
          <h3>Restaurants gérés</h3>
          {restaurants && restaurants.filter(r => r.serverId === server.id).length > 0 ? (
            <div className="restaurants-list">
              {restaurants
                .filter(r => r.serverId === server.id)
                .map(restaurant => (
                  <div 
                    key={restaurant.id} 
                    className="restaurant-card"
                    onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}`)}
                  >
                    <h4>{restaurant.name}</h4>
                    <p>Adresse: {restaurant.address}</p>
                    <p>Tables: {restaurant.tableNumber}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-data">Aucun restaurant attribué</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServerInformation;