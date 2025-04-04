import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './categorieManagement.css';

function CategorieManagement({ categories = [] }) {
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const handleAddCategorie = () => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement/addCategorie`);
  };

  const handleCategorieClick = (categorieId) => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement/categorieOption/${categorieId}`);
  };

  return (
    <div className="categorie-management-container">
      <div className="header-section">
        <h1>Gestion des Catégories</h1>
        <button onClick={handleAddCategorie} className="add-categorie-btn">
          + Ajouter une Catégorie
        </button>
      </div>

      {categories.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((categorie) => (
              <tr
                key={categorie.id}
                onClick={() => handleCategorieClick(categorie.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{categorie.id}</td>
                <td>{categorie.name}</td>
                <td>
                  {categorie.photo ? (
                    <img
                      src={categorie.photo}
                      alt={categorie.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'Aucune photo'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune catégorie disponible pour ce restaurant.</p>
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

export default CategorieManagement;