import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './managerInformation.css';

function ManagerInformation({ managers, restaurants }) {
  const { managerId } = useParams();
  const navigate = useNavigate();

  // Trouver le manager correspondant à l'ID
  const manager = managers.find((m) => m.id === parseInt(managerId));

  if (!manager) {
    return (
      <div className="not-found">
        <h2>Manager non trouvé</h2>
        <button onClick={() => navigate('/managerList')} className="back-button">
          Retour à la liste
        </button>
      </div>
    );
  }

  // Formatage des données pour affichage
  const managerDetails = [
    { label: 'ID', value: manager.id },
    { label: 'Nom complet', value: manager.name },
    { label: 'CIN', value: manager.cin || 'Non spécifié' },
    { label: 'Matricule', value: manager.matricule },
    { label: 'Mot de passe', value: manager.password }, // Ligne ajoutée
    { label: 'Téléphone', value: manager.phone },
    { label: 'Rôle', value: manager.role },
    { 
      label: 'Date de création', 
      value: manager.creationDate || new Date().toLocaleDateString() 
    },
  ];

  return (
    <div className="manager-info-container">
      <div className="header-section">
        <h1>Fiche Manager</h1>
        <div className="action-buttons">
          
          <button 
            onClick={() => navigate('/login/homeAdmin/managerList')} 
            className="back-button"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="manager-profile">
        <div className="avatar-section">
          <div className="avatar-placeholder">
            {manager.name.charAt(0).toUpperCase()}
          </div>
          <h2>{manager.name}</h2>
          <p className="manager-id">ID: {manager.id}</p>
        </div>

        <div className="details-section">
          <h3>Informations personnelles</h3>
          <div className="details-grid">
            {managerDetails.map((detail, index) => (
              <div key={index} className="detail-item">
                <span className="detail-label">{detail.label}:</span>
                <span className="detail-value">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="restaurants-section">
          <h3>Restaurants gérés</h3>
          {restaurants && restaurants.filter(r => r.managerId === manager.id).length > 0 ? (
            <div className="restaurants-list">
              {restaurants
                .filter(r => r.managerId === manager.id)
                .map(restaurant => (
                  <div 
                    key={restaurant.id} 
                    className="restaurant-card"
                    onClick={() => navigate(`/restaurantManagement/${restaurant.id}`)}
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

export default ManagerInformation;