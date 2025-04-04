import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AddCategorie.css';

// Constantes de validation
const VALIDATION_RULES = {
  image: /\.(jpe?g|png|gif|webp)$/i
};

const ERROR_MESSAGES = {
  name: { 
    required: 'Le nom de la catégorie est requis', 
    minLength: 'Minimum 3 caractères' 
  },
  photo: {
    invalidType: 'Formats acceptés: JPEG, PNG, GIF, WEBP',
    tooLarge: 'La photo ne doit pas dépasser 5MB',
    required: 'Une photo est requise'
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const INITIAL_CATEGORIE = {
  name: '',
  photo: null
};

function AddCategorie({ onAddCategorie }) {
  const { addCategorie } = useAuth();
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [newCategorie, setNewCategorie] = useState(INITIAL_CATEGORIE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Nettoyage de l'URL lors du démontage
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCategorie(prev => ({ ...prev, [name]: value }));
    setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validation du type de fichier
    if (!VALIDATION_RULES.image.test(file.name)) {
      setErrors(prev => ({ ...prev, photo: ERROR_MESSAGES.photo.invalidType }));
      return;
    }
    
    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, photo: ERROR_MESSAGES.photo.tooLarge }));
      return;
    }

    setNewCategorie(prev => ({
      ...prev,
      photo: file
    }));
    
    setPhotoPreview(URL.createObjectURL(file));
    setErrors(prev => (prev.photo ? { ...prev, photo: '' } : prev));
  }, []);

  const removePhoto = useCallback(() => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setNewCategorie(prev => ({
      ...prev,
      photo: null
    }));
    setPhotoPreview(null);
  }, [photoPreview]);

  const validateForm = useCallback(() => {
    const { name, photo } = newCategorie;
    const newErrors = {};

    if (!name.trim()) newErrors.name = ERROR_MESSAGES.name.required;
    else if (name.length < 3) newErrors.name = ERROR_MESSAGES.name.minLength;

    if (!photo) newErrors.photo = ERROR_MESSAGES.photo.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newCategorie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', newCategorie.name.trim());
      formData.append('restaurantId', restaurantId);
      
      if (newCategorie.photo) {
        formData.append('photo', newCategorie.photo);
      }

      console.log('Envoi des données:', {
        name: newCategorie.name,
        hasPhoto: !!newCategorie.photo
      });

      const response = await addCategorie(formData);

      console.log('Réponse du serveur:', response);

      if (!response) throw new Error('Aucune réponse du serveur');
      if (response.error) throw new Error(response.error);

      // Si le backend ne renvoie pas la photo, on ajoute la preview locale
      const completeCategorie = {
        ...response,
        photo: response.photo || photoPreview
      };

      onAddCategorie?.(completeCategorie);
      setNewCategorie(INITIAL_CATEGORIE);
      setPhotoPreview(null);
      setErrors({});

      navigate(`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement`, {
        state: {
          success: true,
          message: `Catégorie "${response.name}" créée avec succès`,
          newCategorie: completeCategorie
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      setErrors({
        submit: error.response?.data?.message || error.message || 'Erreur lors de la création de la catégorie'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-categorie-container">
      <h2>Ajouter une nouvelle catégorie</h2>

      {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        {/* Champ Nom */}
        <div className="form-group">
          <label htmlFor="name">Nom de la catégorie*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCategorie.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="Nom de la catégorie"
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Champ Photo */}
        <div className="form-group">
          <label htmlFor="photo">Photo*</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handlePhotoChange}
            className={errors.photo ? 'error' : ''}
          />
          <small>Format accepté: JPEG, PNG, GIF, WEBP (max 5MB)</small>
          {errors.photo && <span className="error-text">{errors.photo}</span>}
          
          {/* Aperçu de la photo */}
          {photoPreview && (
            <div className="photo-preview-container">
              <div className="photo-preview-item">
                <img
                  src={photoPreview}
                  alt={`Aperçu ${newCategorie.photo?.name || 'photo'}`}
                  className="photo-preview"
                />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={removePhoto}
                  aria-label="Supprimer cette photo"
                >
                  ×
                </button>
                <small>{newCategorie.photo?.name}</small>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/categorieManagement`)}
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
            ) : 'Ajouter la catégorie'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategorie;