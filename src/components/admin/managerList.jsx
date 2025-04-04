import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerList.css'; // Import du CSS

const ManagerList = ({ managers = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredManagers = managers.filter(manager => {
    const searchLower = searchTerm.toLowerCase();
    return (
      manager.matricule.toLowerCase().includes(searchLower) ||
      manager.name.toLowerCase().includes(searchLower)
    );
  });

  const handleRowClick = (managerId) => {
    navigate(`/login/homeAdmin/managerOption/${managerId}`);
  };

  return (
    <div className="manager-list-container">
      <h2>Liste des Managers</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom ou CIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="managers-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Nom</th>
            <th>CIN/Matricule</th>
          </tr>
        </thead>
        <tbody>
  {filteredManagers.length > 0 ? (
    filteredManagers.map((manager) => (
      <tr 
        key={manager.id}
        onClick={() => handleRowClick(manager.id)}
        className="table-row"
      >
        <td className="table-cell" data-label="ID">{manager.id}</td>
        <td className="table-cell" data-label="Nom">{manager.name}</td>
        <td className="table-cell" data-label="CIN/Matricule">{manager.matricule}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="no-results">
        Aucun manager trouvé
      </td>
    </tr>
  )}
</tbody>
      </table>
      <button className="back-button" onClick={() => navigate('/login/homeAdmin')}>
        Back
      </button>
    </div>
  );
};

export default ManagerList;