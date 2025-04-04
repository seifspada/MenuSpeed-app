import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './serverManagement.css';

function ServerManagement({ servers = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const handleAddServer = () => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement/addServer`);
  };

  const handleServerClick = (serverId) => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement/serverOption/${serverId}`);
  };

  const filteredServers = servers.filter(server => {
    // Vérification que server existe et a les propriétés nécessaires
    if (!server) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const matricule = server.matricule ? server.matricule.toLowerCase() : '';
    const name = server.name ? server.name.toLowerCase() : '';
    
    return (
      matricule.includes(searchLower) ||
      name.includes(searchLower)
    );
  });

  return (
    <div className="server-management-container">
      <div className="header-section">
        <h1>Gestion des Serveurs</h1>
        <button onClick={handleAddServer} className="add-server-btn">
          + Ajouter un Serveur
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom ou matricule..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {filteredServers.length > 0 ? (
        <table className="servers-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Matricule</th>
            </tr>
          </thead>
          <tbody>
            {filteredServers.map((server) => (
              <tr 
                key={server.id} 
                onClick={() => handleServerClick(server.id)}
                className="server-row"
              >
                <td>{server.id}</td>
                <td>{server.name || 'N/A'}</td>
                <td>{server.matricule || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : servers.length > 0 ? (
        <p className="no-results">Aucun serveur ne correspond à votre recherche.</p>
      ) : (
        <p className="no-servers">Aucun serveur disponible pour ce restaurant.</p>
      )}

      <button 
        className="back-button" 
        onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}`)}
      >
        Retour
      </button>
    </div>
  );
}

export default ServerManagement;