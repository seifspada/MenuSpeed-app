import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const [credentials, setCredentials] = useState({
    matricule: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { managers, servers, login } = useAuth();

  // Compte admin hardcodé (à remplacer par une vérification sécurisée en production)
  const adminAccount = {
    id: 0,
    name: 'Administrateur',
    matricule: 'admin',
    password: 'admin123', // À changer en production!
    role: 'admin',
    phone: '0000000000'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Vérification du compte admin en premier
      if (credentials.matricule.toLowerCase() === adminAccount.matricule && 
          credentials.password === adminAccount.password) {
        login(adminAccount);
        navigate('/HomeAdmin');
        return;
      }

      // Vérification dans les managers
      const manager = managers.find(m => 
        m.matricule.toLowerCase() === credentials.matricule.toLowerCase() && 
        m.password === credentials.password
      );

      // Si pas manager, vérification dans les serveurs
      const server = !manager ? servers.find(s => 
        s.matricule.toLowerCase() === credentials.matricule.toLowerCase() && 
        s.password === credentials.password
      ) : null;

      const user = manager || server;

      if (user) {
        login(user);
        switch (user.role) {
          case 'manager':
            navigate('/login/homeManager');
            break;
          case 'server':
            navigate('/login/homeServer');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Matricule ou mot de passe incorrect');
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        
        <div className='input-box'>
          <input
            type="text"
            name="matricule"
            placeholder='Matricule'
            value={credentials.matricule}
            onChange={handleChange}
            required
          />
          <FaUser className="icon" />
        </div>
        
        <div className='input-box'>
          <input
            type="password"
            name="password"
            placeholder='Mot de passe'
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <FaLock className='icon' />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default Login;