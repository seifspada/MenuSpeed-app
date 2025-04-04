import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './updateRestaurant.css';

const UpdateRestaurant = ({ restaurants, onUpdateRestaurant }) => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    tableNumber: '',
    phone: '',
    address: '',
    mapsLink: '',
    photo: null,
    photoUrl: ''
  });

  // Charger les données du restaurant à modifier
  useEffect(() => {
    if (restaurants && restaurantId) {
      const idToFind = isNaN(restaurantId) ? restaurantId : parseInt(restaurantId);
      
      const restaurantToUpdate = restaurants.find(restaurant => 
        restaurant.id === idToFind || restaurant._id === idToFind
      );

      if (restaurantToUpdate) {
        setFormData({
          name: restaurantToUpdate.name || '',
          tableNumber: restaurantToUpdate.tableNumber || '',
          phone: restaurantToUpdate.phone || '',
          address: restaurantToUpdate.address || '',
          mapsLink: restaurantToUpdate.mapsLink || '',
          photo: null,
          photoUrl: restaurantToUpdate.photo || ''
        });
      }
    }
  }, [restaurants, restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      photo: e.target.files[0],
      photoUrl: URL.createObjectURL(e.target.files[0]) 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('tableNumber', formData.tableNumber);
    formDataToSend.append('phone', formData.phone.trim());
    formDataToSend.append('address', formData.address.trim());
    formDataToSend.append('mapsLink', formData.mapsLink.trim());
    
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    } else if (formData.photoUrl) {
      formDataToSend.append('photoUrl', formData.photoUrl);
    }

    const updatedRestaurant = { 
      ...formData,
      id: isNaN(restaurantId) ? restaurantId : parseInt(restaurantId)
    };
    
    onUpdateRestaurant(updatedRestaurant, formDataToSend);
    navigate('/login/homeManager');
  };

  return (
    <div className="update-restaurant-container">
      <h2 className="update-restaurant-title">Modifier le restaurant (ID: {restaurantId})</h2>
      
      <div className="current-data" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h4>Données actuelles:</h4>
        <p>Nom: {formData.name || 'Non renseigné'}</p>
        <p>Nombre de tables: {formData.tableNumber || 'Non renseigné'}</p>
        <p>Téléphone: {formData.phone || 'Non renseigné'}</p>
        <p>Adresse: {formData.address || 'Non renseigné'}</p>
        {formData.photoUrl && (
          <div>
            <p>Photo actuelle:</p>
            <img src={formData.photoUrl} alt="Restaurant" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="restaurant-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">Nom du restaurant</label>
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
          <label htmlFor="tableNumber">Nombre de tables</label>
          <input
            type="number"
            id="tableNumber"
            name="tableNumber"
            value={formData.tableNumber}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mapsLink">Lien Google Maps</label>
          <input
            type="url"
            id="mapsLink"
            name="mapsLink"
            value={formData.mapsLink}
            onChange={handleChange}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo">Photo du restaurant</label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
          />
          {formData.photoUrl && !formData.photo && (
            <p className="file-info">Photo actuelle conservée</p>
          )}
          {formData.photo && (
            <p className="file-info">Nouvelle photo sélectionnée: {formData.photo.name}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/login/homeManager')}>
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

export default UpdateRestaurant;