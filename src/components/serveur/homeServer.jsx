import React from 'react';
import './homeServer.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Icône de déconnexion


function homeServer() {
   
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
            <Link to="/managerList">
              <button className="dashboard-button">Manager List</button>
            </Link>
            <Link to="/addManager">
              <button className="dashboard-button">Add Manager</button>
            </Link>
          </div>
        </div>
      );
    
    
}

export default homeServer;