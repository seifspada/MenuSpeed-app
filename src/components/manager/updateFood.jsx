import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './updateFood.css';

const UpdateFood = ({ foods, onUpdateFood }) => {
  const navigate = useNavigate();
  const { foodId, restaurantId } = useParams();
  
  // Vérification initiale des paramètres
  if (!restaurantId) {
    console.error("restaurantId est undefined!");
    // Vous pourriez rediriger vers une page d'erreur ici
    // navigate('/error');
  }

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    photo: '',
  });

  useEffect(() => {
    if (foods && foodId) {
      const idToFind = isNaN(foodId) ? foodId : parseInt(foodId);
      const foodToUpdate = foods.find(food => 
        food.id === idToFind || food._id === idToFind
      );

      if (foodToUpdate) {
        setFormData({
          name: foodToUpdate.name || '',
          price: foodToUpdate.price ?? '',
          description: foodToUpdate.description || '',
          photo: Array.isArray(foodToUpdate.photo) 
                ? foodToUpdate.photo[0] || '' 
                : foodToUpdate.photo || '',
        });
      }
    }
  }, [foods, foodId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation supplémentaire
    if (!restaurantId) {
      console.error("Impossible de continuer: restaurantId manquant");
      return;
    }

    const updatedFood = { 
      ...formData,
      price: formData.price ? Number(formData.price) : null,
      id: isNaN(foodId) ? foodId : parseInt(foodId)
    };

    try {
      onUpdateFood(updatedFood);
      navigate(`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      // Gérer l'erreur (peut-être afficher un message à l'utilisateur)
    }
  };

  return (
    <div className="add-food-container">
      <h2 className="add-food-title">Modifier le plat (ID: {foodId})</h2>
      
      <div className="current-data">
        <h4>Données actuelles:</h4>
        <p>Nom: {formData.name || 'Non renseigné'}</p>
        <p>Prix: {formData.price || 'Non renseigné'}</p>
        <p>Description: {formData.description || 'Non renseigné'}</p>
      </div>

      <form onSubmit={handleSubmit} className="food-form">
        <div className="form-group">
          <label htmlFor="name">Nom du plat</label>
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
          <label htmlFor="price">Prix</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo">Photo (URL)</label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="Entrez l'URL de la photo"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement`)}>
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

export default UpdateFood;