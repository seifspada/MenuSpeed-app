import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './addFood.css';

// Constantes de validation
const VALIDATION_RULES = {
  price: /^\d+(\.\d{1,2})?$/,
  image: /\.(jpe?g|png|gif|webp)$/i
};

const ERROR_MESSAGES = {
  name: { 
    required: 'Le nom du plat est requis', 
    minLength: 'Minimum 3 caractères' 
  },
  price: { 
    required: 'Le prix est requis', 
    invalid: 'Format prix invalide (ex: 12.99)' 
  },
  description: { 
    required: 'La description est requise', 
    minLength: 'Minimum 10 caractères' 
  },
  photos: {
    max: 'Maximum 3 photos autorisées',
    invalidType: 'Formats acceptés: JPEG, PNG, GIF, WEBP',
    tooLarge: 'Chaque photo ne doit pas dépasser 5MB',
    required: 'Au moins une photo est requise'
  },
  category: { 
    required: 'Veuillez sélectionner une catégorie' 
  }
};

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const INITIAL_FOOD = {
  name: '',
  price: '',
  description: '',
  photos: [],
  categoryId: ''
};

function AddFood({ onAddFood, categories = [] }) {
  const { addFood } = useAuth();
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [newFood, setNewFood] = useState(INITIAL_FOOD);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Nettoyage des URLs lors du démontage
  useEffect(() => {
    return () => {
      photoPreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [photoPreviews]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewFood(prev => ({ ...prev, [name]: value }));
    setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    // Vérification du nombre max de photos
    if (newFood.photos.length + files.length > MAX_PHOTOS) {
      setErrors(prev => ({ ...prev, photos: ERROR_MESSAGES.photos.max }));
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      // Validation du type de fichier
      if (!VALIDATION_RULES.image.test(file.name)) {
        setErrors(prev => ({ ...prev, photos: ERROR_MESSAGES.photos.invalidType }));
        return;
      }
      // Validation de la taille
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, photos: ERROR_MESSAGES.photos.tooLarge }));
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length === 0) return;

    setNewFood(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles]
    }));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    setErrors(prev => (prev.photos ? { ...prev, photos: '' } : prev));
  }, [newFood.photos.length]);

  const removePhoto = useCallback((index) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setNewFood(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  }, [photoPreviews]);

  const validateForm = useCallback(() => {
    const { name, price, description, photos, categoryId } = newFood;
    const newErrors = {};

    if (!name.trim()) newErrors.name = ERROR_MESSAGES.name.required;
    else if (name.length < 3) newErrors.name = ERROR_MESSAGES.name.minLength;

    if (!price.trim()) newErrors.price = ERROR_MESSAGES.price.required;
    else if (!VALIDATION_RULES.price.test(price)) newErrors.price = ERROR_MESSAGES.price.invalid;

    if (!description.trim()) newErrors.description = ERROR_MESSAGES.description.required;
    else if (description.length < 10) newErrors.description = ERROR_MESSAGES.description.minLength;

    if (photos.length === 0) newErrors.photos = ERROR_MESSAGES.photos.required;

    if (!categoryId) newErrors.category = ERROR_MESSAGES.category.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newFood]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', newFood.name.trim());
      formData.append('price', newFood.price);
      formData.append('description', newFood.description.trim());
      formData.append('categoryId', newFood.categoryId);
      
      // Ajout des photos avec la bonne clé (selon ce qu'attend votre backend)
      newFood.photos.forEach((photo, index) => {
        formData.append(`photos`, photo); // Certains backends préfèrent 'photos[]'
      });

      console.log('Envoi des données:', {
        name: newFood.name,
        price: newFood.price,
        photoCount: newFood.photos.length
      });

      const response = await addFood(restaurantId, formData);

      console.log('Réponse du serveur:', response);

      if (!response) throw new Error('Aucune réponse du serveur');
      if (response.error) throw new Error(response.error);

      // Si le backend ne renvoie pas les photos, on ajoute les previews locales
      const completeFood = {
        ...response,
        photos: response.photos || photoPreviews.map((preview, index) => ({
          url: preview,
          name: newFood.photos[index].name
        }))
      };

      onAddFood?.(completeFood);
      setNewFood(INITIAL_FOOD);
      setPhotoPreviews([]);
      setErrors({});

      navigate(`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement`, {
        state: {
          success: true,
          message: `Plat "${response.name}" créé avec succès`,
          newFood: completeFood
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création du plat:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      setErrors({
        submit: error.response?.data?.message || error.message || 'Erreur lors de la création du plat'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-food-container">
      <h2>Ajouter un nouveau plat</h2>

      {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        {/* Champ Nom */}
        <div className="form-group">
          <label htmlFor="name">Nom du plat*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newFood.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="Nom du plat"
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Champ Prix */}
        <div className="form-group">
          <label htmlFor="price">Prix (€)*</label>
          <input
            type="text"
            id="price"
            name="price"
            value={newFood.price}
            onChange={handleInputChange}
            className={errors.price ? 'error' : ''}
            placeholder="Ex: 12.99"
            required
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        {/* Champ Description */}
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={newFood.description}
            onChange={handleInputChange}
            className={errors.description ? 'error' : ''}
            placeholder="Description détaillée du plat..."
            rows="4"
            required
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Champ Catégorie */}
        <div className="form-group">
          <label htmlFor="category">Catégorie*</label>
          <select
            id="category"
            name="categoryId"
            value={newFood.categoryId}
            onChange={handleInputChange}
            className={errors.category ? 'error' : ''}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Champ Photos */}
        <div className="form-group">
          <label htmlFor="photos">Photos ({newFood.photos.length}/{MAX_PHOTOS})*</label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handlePhotoChange}
            className={errors.photos ? 'error' : ''}
            multiple
            disabled={newFood.photos.length >= MAX_PHOTOS}
          />
          <small>Formats acceptés: JPEG, PNG, GIF, WEBP (max 5MB chacun)</small>
          {errors.photos && <span className="error-text">{errors.photos}</span>}
          
          {/* Aperçu des photos */}
          <div className="photos-preview-container">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="photo-preview-item">
                <img
                  src={preview}
                  alt={`Aperçu ${newFood.photos[index]?.name || 'photo'}`}
                  className="photo-preview"
                />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => removePhoto(index)}
                  aria-label="Supprimer cette photo"
                >
                  ×
                </button>
                <small>{newFood.photos[index]?.name}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/foodManagement`)}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Enregistrement...
              </>
            ) : 'Ajouter le plat'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFood;