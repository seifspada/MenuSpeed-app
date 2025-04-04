import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './addServer.css';

function AddServer({ onAddServer }) {  // Ajout de la prop en paramètre
  const { addServer, restaurantId } = useAuth();
  const navigate = useNavigate();
  
  const [newServer, setNewServer] = useState({
    name: '',
    matricule: '',
    password: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewServer(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\d+$/;
    const matriculeRegex = /^[A-Za-z0-9]+$/;

    if (!newServer.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (newServer.name.length < 2) {
      newErrors.name = 'Minimum 2 caractères';
    }
    
    if (!newServer.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    } else if (!matriculeRegex.test(newServer.matricule)) {
      newErrors.matricule = 'Lettres et chiffres uniquement';
    }
    
    if (!newServer.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (newServer.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    if (!newServer.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!phoneRegex.test(newServer.phone)) {
      newErrors.phone = 'Chiffres uniquement';
    } else if (newServer.phone.length < 8) {
      newErrors.phone = 'Minimum 8 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const createdServer = await addServer({
        ...newServer,
        role: 'server'
      });

      // Appel conditionnel à onAddServer si la prop est fournie
      if (onAddServer) {
        onAddServer(createdServer);
      }
      
      navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement`, {
        state: { 
          success: true,
          message: `Server ${createdServer.matricule} créé avec succès`
        }
      });
      
    } catch (error) {
      setErrors({
        submit: error.message || "Erreur lors de la création"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-server-container">
      <h2>Créer un nouveau server</h2>
      
      {errors.submit && (
        <div className="alert-error">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            name="name"
            value={newServer.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="Nom complet"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Matricule</label>
          <input
            type="text"
            name="matricule"
            value={newServer.matricule}
            onChange={handleInputChange}
            className={errors.matricule ? 'error' : ''}
            placeholder="Matricule unique"
          />
          {errors.matricule && <span className="error-text">{errors.matricule}</span>}
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={newServer.password}
            onChange={handleInputChange}
            className={errors.password ? 'error' : ''}
            placeholder="Minimum 6 caractères"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={newServer.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="Numéro de téléphone"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/login/homeManager/restaurantManagement/${restaurantId}/serverManagement`)}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Enregistrement...
              </>
            ) : 'Créer Server'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddServer;