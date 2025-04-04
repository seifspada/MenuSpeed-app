import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import placeholderImage from '../../assets/background.png';
import './CategorieInformation.css';

function CategorieInformation({ categories = [], foods = [] }) {
  const { categorieId } = useParams();
  const navigate = useNavigate();

  // Trouver la catégorie correspondante
  const categorie = categories.find(cat => cat.id === categorieId);

  if (!categorie) {
    return (
      <div className="not-found">
        <h2>Catégorie non trouvée</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
        >
          Retour
        </button>
      </div>
    );
  }

  // Filtrer les plats de cette catégorie
  const categorieFoods = foods.filter(food => food.categoryId === categorieId);

  // Fonction pour obtenir l'image de la catégorie
  const getCategorieImage = () => {
    if (categorie.photo) {
      return categorie.photo.startsWith('http') || categorie.photo.startsWith('data:image') 
        ? categorie.photo 
        : `${process.env.PUBLIC_URL}${categorie.photo}`;
    }
    return placeholderImage;
  };

  return (
    <div className="categorie-info-container">
      <div className="header-section">
        <h1>Fiche de la catégorie</h1>
        <div className="action-buttons">
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="categorie-profile">
        <div className="avatar-section">
          <img 
            src={getCategorieImage()} 
            alt={categorie.name} 
            className="categorie-photo"
            onError={(e) => e.target.src = placeholderImage}
          />
          <h2>{categorie.name}</h2>
        </div>

        <div className="foods-section">
          <h3>Plats de cette catégorie ({categorieFoods.length})</h3>
          
          {categorieFoods.length > 0 ? (
            <div className="foods-grid">
              {categorieFoods.map(food => (
                <div key={food.id} className="food-card">
                  <div className="food-image-container">
                    <img 
                      src={food.photos?.[0] || placeholderImage} 
                      alt={food.name}
                      onError={(e) => e.target.src = placeholderImage}
                    />
                  </div>
                  <div className="food-details">
                    <h4>{food.name}</h4>
                    <p>{food.price?.toFixed(2)} €</p>
                    <p className="food-description">
                      {food.description || 'Aucune description disponible'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-foods">
              <p>Aucun plat dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategorieInformation;