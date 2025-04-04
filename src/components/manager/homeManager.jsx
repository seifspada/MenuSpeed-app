import React from 'react';
import './homeManager.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

function HomeManager({ restaurants }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}`);
  };

  return (
    <div className="dashboard">
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="logout-icon" /> Déconnexion
      </button>

      <h1>Manager Dashboard</h1>

      <div className="restaurant-table">
        <h2>Liste des Restaurants</h2>
        {restaurants && restaurants.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Nom</th>
                <th>Adresse</th>
                <th>Tables</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr
                  key={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{restaurant.id}</td>
                  <td>
  {restaurant.photoUrl ? (
    <img 
      src={restaurant.photoUrl} 
      alt={restaurant.name}
      className="restaurant-table-photo"
    />
  ) : (
    <div className="no-photo">Pas de photo</div>
  )}
</td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>{restaurant.tableNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun restaurant disponible.</p>
        )}
      </div>

      <div className="dashboard-buttons">
        <Link to="/login/homeManager/addRestaurant">
          <button className="dashboard-button">Ajouter Restaurant</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeManager;