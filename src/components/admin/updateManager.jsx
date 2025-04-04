import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddManager.css';

const UpdateManager = ({ managers, onUpdateManager }) => {
  const navigate = useNavigate();
  const { managerId } = useParams(); // Changé pour utiliser managerId
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    matricule: '',
    password: '',
    role: 'manager'
  });

  // Charger les données du manager à modifier
  useEffect(() => {
    console.log('ManagerId reçu:', managerId); // Debug
    console.log('Liste des managers:', managers); // Debug

    if (managers && managerId) {
      // Conversion en nombre si nécessaire (selon votre structure de données)
      const idToFind = isNaN(managerId) ? managerId : parseInt(managerId);
      
      const managerToUpdate = managers.find(manager => 
        manager.id === idToFind || manager._id === idToFind // Adapté pour MongoDB ou autres
      );

      console.log('Manager trouvé:', managerToUpdate); // Debug

      if (managerToUpdate) {
        setFormData({
          name: managerToUpdate.name || '',
          phone: managerToUpdate.phone || '',
          matricule: managerToUpdate.matricule || '',
          password: managerToUpdate.password || '',
          role: managerToUpdate.role || 'manager'
        });
      } else {
        console.warn('Manager non trouvé avec ID:', managerId);
      }
    }
  }, [managers, managerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedManager = { 
      ...formData, 
      id: isNaN(managerId) ? managerId : parseInt(managerId) // Garde la cohérence avec l'ID original
    };
    console.log('Données soumises:', updatedManager); // Debug
    onUpdateManager(updatedManager);
    navigate('/login/homeAdmin/managerList');
  };

  return (
    <div className="add-manager-container">
      <h2 className="add-manager-title">Modifier le Manager (ID: {managerId})</h2>
      
      {/* Afficher les données actuelles pour vérification */}
      <div className="current-data" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h4>Données actuelles:</h4>
        <p>Nom: {formData.name || 'Non renseigné'}</p>
        <p>Téléphone: {formData.phone || 'Non renseigné'}</p>
        <p>Matricule: {formData.matricule || 'Non renseigné'}</p>
      </div>

      <form onSubmit={handleSubmit} className="manager-form">
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
          <button type="button" className="cancel-btn" onClick={() => navigate('/login/homeAdmin/managerList')}>
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

export default UpdateManager;