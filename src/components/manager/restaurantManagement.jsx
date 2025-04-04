import React from 'react'; // Pas besoin de useState ici pour l'instant
import { useParams, useNavigate, Link } from 'react-router-dom';
import './restaurantManagement.css';

function RestaurantManagement({ restaurants }) { // Ajout de restaurants comme prop
  const { restaurantId } = useParams(); // Récupérer l'ID du restaurant depuis l'URL
  const navigate = useNavigate();

  // Trouver le restaurant correspondant à l'ID (si restaurants est passé en prop)
  const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));

  // Si le restaurant n'est pas trouvé, afficher un message ou rediriger
  if (!restaurant) {
    return (
      <div className="dashboard">
        <h1>Restaurant non trouvé</h1>
        <button className="back-button" onClick={() => navigate('/login/homeManager')}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Gestion du restaurant : {restaurant.name}</h1>
      <div className="dashboard-buttons">
        <Link to={`/login/homeManager/restaurantManagement/${restaurantId}/restaurantOption`}>
          <button className="dashboard-button">Options du restaurant</button>
        </Link>
        <Link to={`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement`}>
          <button className="dashboard-button">Gestion des serveurs</button>
        </Link>
        <Link to={`/login/homeManager/restaurantManagement/${restaurantId}/orderManagement`}>
          <button className="dashboard-button">Gestion des commandes</button>
        </Link>
        <Link to={`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement`}>
          <button className="dashboard-button">Gestion des categories</button>
        </Link>
        <Link to={`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement`}>
          <button className="dashboard-button">Gestion des plats</button>
        </Link>
      </div>
      <button className="back-button" onClick={() => navigate('/login/homeManager')}>
        Retour
      </button>
    </div>
  );
}

export default RestaurantManagement;