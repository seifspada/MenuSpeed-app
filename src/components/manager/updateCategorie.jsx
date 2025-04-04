import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './updateCategorie.css'; // Tu peux réutiliser le style existant

const UpdateCategorie = ({ categories, onUpdateCategorie }) => {
  const navigate = useNavigate();
  const { categorieId, restaurantId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
  });

  useEffect(() => {
    if (categories && categorieId) {
      const idToFind = isNaN(categorieId) ? categorieId : parseInt(categorieId);
      const catToUpdate = categories.find(cat =>
        cat.id === idToFind || cat._id === idToFind
      );

      if (catToUpdate) {
        setFormData({
          name: catToUpdate.name || '',
          photo: Array.isArray(catToUpdate.photo)
            ? catToUpdate.photo[0] || ''
            : catToUpdate.photo || '',
        });
      }
    }
  }, [categories, categorieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!restaurantId) {
      console.error("restaurantId manquant !");
      return;
    }

    const updatedCategorie = {
      id: isNaN(categorieId) ? categorieId : parseInt(categorieId),
      ...formData,
    };

    try {
      onUpdateCategorie(updatedCategorie);
      navigate(`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
    }
  };

  return (
    <div className="add-food-container">
      <h2 className="add-food-title">Modifier la Catégorie (ID: {categorieId})</h2>

      <form onSubmit={handleSubmit} className="food-form">
        <div className="form-group">
          <label htmlFor="name">Nom de la catégorie</label>
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

        {formData.photo && (
          <div className="photo-preview">
            <p>Aperçu :</p>
            <img
              src={formData.photo}
              alt="Aperçu"
              style={{ width: '120px', height: 'auto', borderRadius: '8px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/120?text=Image+non+valide';
              }}
            />
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement`)}
          >
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

export default UpdateCategorie;
