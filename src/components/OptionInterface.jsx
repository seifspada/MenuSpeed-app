import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './OptionInterface.css';

function OptionInterface({ 
  entityType, 
  deleteFunction, 
  backPath, 
  infoPath, 
  updatePath 
}) {
  const { serverId, restaurantId, foodId, managerId } = useParams(); // Ajout de managerId
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Détermine l'ID en fonction du type d'entité
  const entityId = serverId || restaurantId || foodId || managerId;
  const entityName = entityType.charAt(0).toUpperCase() + entityType.slice(1);

  const handleConfirmDelete = () => {
    deleteFunction(parseInt(entityId));
    // Remplacer les paramètres dynamiques dans backPath
    let resolvedBackPath = backPath
      .replace(':restaurantId', restaurantId || '')
      .replace(':managerId', managerId || '');
    navigate(resolvedBackPath);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  // Fonction pour résoudre les chemins avec tous les paramètres possibles
  const resolvePath = (path) => {
    return path
      .replace(':serverId', serverId || '')
      .replace(':restaurantId', restaurantId || '')
      .replace(':foodId', foodId || '')
      
      .replace(':managerId', managerId || '');
  };

  return (
    <div className="dashboard">
      <h1>Options du {entityName.toLowerCase()}</h1>
      <div className="dashboard-buttons">
        <Link to={resolvePath(infoPath)}>
          <button className="dashboard-button">Informations</button>
        </Link>
        <Link to={resolvePath(updatePath)}>
          <button className="dashboard-button update">Modifier</button>
        </Link>
        <button
          className="dashboard-button delete"
          onClick={() => setShowConfirmation(true)}
        >
          Supprimer
        </button>
      </div>
      <button 
        className="back-button" 
        onClick={() => navigate(resolvePath(backPath))}
      >
        Retour
      </button>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h2>Confirmez la suppression de ce {entityName.toLowerCase()} ?</h2>
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={handleConfirmDelete}>
                Confirmer
              </button>
              <button className="cancel-button" onClick={handleCancelDelete}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptionInterface;