import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './updateServer.css';

const UpdateServer = ({ servers, onUpdateServer }) => {
  const navigate = useNavigate();
  const { serverId, restaurantId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    matricule: '',
    password: '',
    role: 'server'
  });

  // Charger les données du serveur à modifier
  useEffect(() => {
    if (servers && serverId) {
      const idToFind = isNaN(serverId) ? serverId : parseInt(serverId);
      
      const serverToUpdate = servers.find(server => 
        server.id === idToFind || server._id === idToFind
      );

      if (serverToUpdate) {
        setFormData({
          name: serverToUpdate.name || '',
          phone: serverToUpdate.phone || '',
          matricule: serverToUpdate.matricule || '',
          password: serverToUpdate.password || '', // Ne pas pré-remplir le mot de passe
          role: serverToUpdate.role || 'server'
        });
      }
    }
  }, [servers, serverId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedServer = { 
      ...formData, 
      id: isNaN(serverId) ? serverId : parseInt(serverId)
    };
    onUpdateServer(updatedServer);
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement`);
  };

  return (
    <div className="add-server-container">
      <h2 className="add-server-title">Modifier le server (ID: {serverId})</h2>
      
      {/* Afficher les données actuelles pour vérification */}
      <div className="current-data" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h4>Données actuelles:</h4>
        <p>Nom: {formData.name || 'Non renseigné'}</p>
        <p>Téléphone: {formData.phone || 'Non renseigné'}</p>
        <p>Matricule: {formData.matricule || 'Non renseigné'}</p>
      </div>

      <form onSubmit={handleSubmit} className="server-form">
        <div className="form-group">
          <label htmlFor="name">Nom complet</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="matricule">CIN/Matricule</label>
          <input
            type="text"
            id="matricule"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Entrez un nouveau mot de passe ou laissez l'ancien"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement`)}>
            Annuler
          </button>
          <button type="submit" className="submit-btn">
            Mettre à jour
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateServer;