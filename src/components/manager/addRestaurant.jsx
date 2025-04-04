import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './addRestaurant.css';

// Constantes pour les regex et messages d'erreur
const VALIDATION_RULES = {
  phone: /^[0-9]{8,}$/,
  tableNumber: /^[1-9]\d*$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  image: /\.(jpe?g|png|gif|webp)$/i
};

const ERROR_MESSAGES = {
  name: {
    required: 'Le nom du restaurant est requis',
    minLength: 'Minimum 2 caractères'
  },
  tableNumber: {
    required: 'Le nombre de tables est requis',
    invalid: 'Nombre entier positif requis'
  },
  phone: {
    required: 'Le téléphone est requis',
    invalid: 'Minimum 8 chiffres requis'
  },
  address: {
    required: "L'adresse est requise",
    minLength: "L'adresse est trop courte (min 10 caractères)"
  },
  mapsLink: {
    required: "Le lien Google Maps est requis",
    invalid: "URL invalide"
  },
  photoUrl: {
    required: "Une photo est requise",
    invalidType: "Formats acceptés: JPEG, PNG, GIF, WEBP",
    tooLarge: "La photo ne doit pas dépasser 5MB"
  }
};

const INITIAL_RESTAURANT = {
  name: '',
  tableNumber: '',
  phone: '',
  address: '',
  mapsLink: '',
  photoUrl: null
};

function AddRestaurant({ onAddRestaurant }) {
  const { addRestaurant } = useAuth();
  const navigate = useNavigate();
  
  const [newRestaurant, setNewRestaurant] = useState(INITIAL_RESTAURANT);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  // Nettoyage de l'URL d'object lors du démontage
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewRestaurant(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validation du fichier
    if (!VALIDATION_RULES.image.test(file.name)) {
      setErrors(prev => ({ ...prev, photoUrl: ERROR_MESSAGES.photoUrl.invalidType }));
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photoUrl: ERROR_MESSAGES.photoUrl.tooLarge }));
      return;
    }
  
    setNewRestaurant(prev => ({
      ...prev,
      photoUrl: file
    }));
  
    // Création de l'aperçu
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }, []); // Ajoutez les dépendances nécessaires si vous en utilisez

  const validateForm = useCallback(() => {
    const { name, tableNumber, phone, address, mapsLink, photoUrl } = newRestaurant; // Changé de photo à photoUrl
  const newErrors = {};

    // Validation du nom
    if (!name.trim()) {
      newErrors.name = ERROR_MESSAGES.name.required;
    } else if (name.length < 2) {
      newErrors.name = ERROR_MESSAGES.name.minLength;
    }

    // Validation du nombre de tables
    if (!tableNumber) {
      newErrors.tableNumber = ERROR_MESSAGES.tableNumber.required;
    } else if (!VALIDATION_RULES.tableNumber.test(tableNumber)) {
      newErrors.tableNumber = ERROR_MESSAGES.tableNumber.invalid;
    }

    // Validation du téléphone
    if (!phone.trim()) {
      newErrors.phone = ERROR_MESSAGES.phone.required;
    } else if (!VALIDATION_RULES.phone.test(phone)) {
      newErrors.phone = ERROR_MESSAGES.phone.invalid;
    }

    // Validation de l'adresse
    if (!address.trim()) {
      newErrors.address = ERROR_MESSAGES.address.required;
    } else if (address.length < 10) {
      newErrors.address = ERROR_MESSAGES.address.minLength;
    }

    // Validation du lien Maps
    if (!mapsLink.trim()) {
      newErrors.mapsLink = ERROR_MESSAGES.mapsLink.required;
    } else if (!VALIDATION_RULES.url.test(mapsLink)) {
      newErrors.mapsLink = ERROR_MESSAGES.mapsLink.invalid;
    }

    // Validation de la photo
    if (!photoUrl) {
      newErrors.photoUrl = ERROR_MESSAGES.photoUrl.required;
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newRestaurant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newRestaurant.name.trim());
      formData.append('tableNumber', newRestaurant.tableNumber);
      formData.append('phone', newRestaurant.phone.trim());
      formData.append('address', newRestaurant.address.trim());
      formData.append('mapsLink', newRestaurant.mapsLink.trim());
      formData.append('photo', newRestaurant.photoUrl); // Maintenant cohérent
  
      const response = await addRestaurant(formData);
      
      if (!response) throw new Error('Aucune réponse du serveur');
      if (response.error) throw new Error(response.error);
  
      // Vérifiez que la réponse contient bien l'URL de la photo
      if (!response.photoUrl) {
        console.warn("Le serveur n'a pas retourné d'URL pour la photo");
      }
  
      onAddRestaurant?.(response);
     
      setNewRestaurant(INITIAL_RESTAURANT);
    setPhotoPreview('');
    setErrors({});
    
      navigate('/login/homeManager', {
        state: { 
          success: true,
          message: `Restaurant "${response.name}" créé avec succès`,
          newRestaurant: response // Doit contenir photoUrl
        }
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({
        submit: error.response?.data?.message || 
               error.message || 
               "Erreur lors de la création"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-restaurant-container">
      <h2>Créer un nouveau restaurant</h2>
      
      {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <FormField
          label="Nom du restaurant*"
          id="name"
          type="text"
          name="name"
          value={newRestaurant.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Nom du restaurant"
          required
        />

        <FormField
          label="Nombre de tables*"
          id="tableNumber"
          type="number"
          name="tableNumber"
          value={newRestaurant.tableNumber}
          onChange={handleInputChange}
          error={errors.tableNumber}
          placeholder="Nombre de tables disponibles"
          min="1"
          required
        />

        <FormField
          label="Téléphone*"
          id="phone"
          type="tel"
          name="phone"
          value={newRestaurant.phone}
          onChange={handleInputChange}
          error={errors.phone}
          placeholder="Numéro de téléphone"
          required
        />

        <FormField
          label="Adresse complète*"
          id="address"
          type="text"
          name="address"
          value={newRestaurant.address}
          onChange={handleInputChange}
          error={errors.address}
          placeholder="Adresse du restaurant"
          required
        />

        <FormField
          label="Lien Google Maps*"
          id="mapsLink"
          type="url"
          name="mapsLink"
          value={newRestaurant.mapsLink}
          onChange={handleInputChange}
          error={errors.mapsLink}
          placeholder="https://maps.app.goo.gl/..."
          required
        />

        <div className="form-group">
          <label htmlFor="photo">Photo du restaurant*</label>
          <input
            type="file"
            id="photoUrl"
            name="photoUrl"
            accept="image/jpeg, image/png, image/gif, image/webp"
            onChange={handlePhotoChange}
            className={errors.photoUrl ? 'error' : ''}
            required
          />
          {errors.photoUrl && <span className="error-text">{errors.photoUrl}</span>}
          {photoPreview && (
            <div className="photo-preview">
              <img 
                src={photoPreview} 
                alt="Aperçu" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px',
                  marginTop: '10px',
                  borderRadius: '4px'
                }} 
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate('/login/homeManager')}
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
            ) : 'Créer Restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Composant réutilisable pour les champs de formulaire
const FormField = React.memo(({ label, error, ...props }) => (
  <div className="form-group">
    <label htmlFor={props.id}>{label}</label>
    <input
      {...props}
      className={error ? 'error' : ''}
    />
    {error && <span className="error-text">{error}</span>}
  </div>
));

export default AddRestaurant;