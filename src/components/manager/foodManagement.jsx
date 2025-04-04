import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import placeholderImage from '../../assets/background.png';
import './foodManagement.css';

function FoodManagement({ foods = [] }) {
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  // Déplacer la fonction formatPrice à l'intérieur du composant
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    
    const num = Number(price);
    if (isNaN(num)) return 'N/A';
    
    return num.toFixed(2) + ' €';
  };

  const handleAddFood = () => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement/addFood`);
  };

  const handleFoodClick = (foodId) => {
    navigate(`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement/foodOption/${foodId}`);
  };

  const getDisplayPhoto = (food) => {
    console.log('Photos pour ce plat:', food.photos);
    if (food?.photos?.length > 0) {
      const firstPhoto = food.photos[0];
      console.log('Première photo:', firstPhoto);
      if (typeof firstPhoto === 'string') {
        return firstPhoto;
      }
      if (firstPhoto instanceof File) {
        return URL.createObjectURL(firstPhoto);
      }
    }
    return placeholderImage;
  };

  return (
    <div className="food-management-container">
      <div className="header-section">
        <h1>Gestion des Plats</h1>
        <button onClick={handleAddFood} className="add-food-btn">
          + Ajouter un Plat
        </button>
      </div>

      {foods.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => {
              if (!food || typeof food !== 'object') return null;
              
              return (
                <tr
                  key={food.id || Math.random()}
                  onClick={() => food.id && handleFoodClick(food.id)}
                  style={{ cursor: food.id ? 'pointer' : 'default' }}
                >
                  <td>
                    <img
                      src={getDisplayPhoto(food)}
                      alt={food.name || 'Image non disponible'}
                      className="food-table-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                      }}
                    />
                  </td>
                  <td>{food.name || 'Nom non spécifié'}</td>
                  <td>{formatPrice(food.price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Aucun plat disponible pour ce restaurant.</p>
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

export default FoodManagement;