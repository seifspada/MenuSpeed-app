import React from 'react';
import './homeAdmin.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Icône de déconnexion

function HomeAdmin() {
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Supprimer les informations de l'utilisateur (ex: token, données de session)
    localStorage.removeItem('token'); // Exemple : supprimer un token stocké
    // Rediriger vers la page de connexion
    navigate('/');
  };

  return (
    <div className="dashboard">
      {/* Bouton de déconnexion */}
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="logout-icon" /> Déconnexion
      </button>

      <h1>Admin Dashboard - Manager Management</h1>
      <div className="dashboard-buttons">
        <Link to="/login/homeAdmin/managerList">
          <button className="dashboard-button">Manager List</button>
        </Link>
        <Link to="/login/homeAdmin/addManager">
          <button className="dashboard-button">Add Manager</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeAdmin;