import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

export const AuthContext = createContext();

const ADMIN_ACCOUNT = {
  id: 0,
  name: 'Administrateur',
  matricule: 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
  role: 'admin',
  phone: '0000000000',
  createdAt: new Date().toISOString()
};

const REQUIRED_USER_FIELDS = ['name', 'matricule', 'password', 'phone'];

const generateId = (array) => array.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const createUser = (userData) => ({
  id: userData.id || 0,
  name: userData.name || '',
  matricule: userData.matricule || '',
  role: userData.role || 'user',
  phone: userData.phone || '',
  createdAt: userData.createdAt || new Date().toISOString()
});

const validateUserData = (data, role) => {
  if (!data || typeof data !== 'object') {
    throw new Error(`Données ${role} invalides`);
  }

  const missingFields = REQUIRED_USER_FIELDS.filter(field => !data[field]);
  if (missingFields.length) {
    throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
  }
};

const createStaffMember = (data, role, existingStaff) => ({
  name: String(data.name),
  matricule: String(data.matricule),
  password: String(data.password),
  phone: String(data.phone),
  id: generateId(existingStaff),
  role,
  createdAt: new Date().toISOString()
});

export const AuthProvider = ({ children, initialManagers = [], initialServers = [], initialRestaurants = [], initialFoods = [],initialCategories = [] }) => {
  const [user, setUser] = useState(parseStoredUser);
  const [managers, setManagers] = useState(initialManagers);
  const [servers, setServers] = useState(initialServers);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [foods, setFoods] = useState(initialFoods);
  const [categories, setCategories] = useState(initialCategories);

  const login = useCallback((userData) => {
    if (!userData || typeof userData !== 'object') return;
    const validUser = createUser(userData);
    setUser(validUser);
    localStorage.setItem('user', JSON.stringify(validUser));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const addManager = useCallback((managerData) => {
    validateUserData(managerData, 'manager');
    const newManager = createStaffMember(managerData, 'manager', managers);
    setManagers(prev => [...prev, newManager]);
    return newManager;
  }, [managers]);

  const addServer = useCallback((serverData) => {
    validateUserData(serverData, 'server');
    const newServer = createStaffMember(serverData, 'server', servers);
    setServers(prev => [...prev, newServer]);
    return newServer;
  }, [servers]);

  const addRestaurant = useCallback(async (restaurantData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          id: Math.floor(Math.random() * 1000),
          ...restaurantData,
          createdAt: new Date().toISOString()
        };
        console.log('Mock response:', mockResponse);
        resolve(mockResponse);
      }, 1000);
    });
  }, []);

  const addFood = useCallback(async (foodData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foodObject = {};
        if (foodData instanceof FormData) {
          foodData.forEach((value, key) => {
            if (key === 'photos') {
              foodObject[key] = foodObject[key] || [];
              foodObject[key].push(value);
            } else {
              foodObject[key] = value;
            }
          });
        } else {
          Object.assign(foodObject, foodData);
        }

        const mockResponse = {
          id: Math.floor(Math.random() * 1000),
          ...foodObject,
          photos: foodObject.photos ? foodObject.photos.map((_, i) => `mock-photo-url-${i}.jpg`) : [],
          createdAt: new Date().toISOString()
        };
        console.log('Mock response:', mockResponse);
        resolve(mockResponse);
      }, 1000);
    });
  }, []);

  const addCategorie = useCallback(async (categorieData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categorieObject = {};
        if (categorieData instanceof FormData) {
          categorieData.forEach((value, key) => {
            if (key === 'photos') {
              categorieObject[key] = categorieObject[key] || [];
              categorieObject[key].push(value);
            } else {
              categorieObject[key] = value;
            }
          });
        } else {
          Object.assign(categorieObject, categorieData);
        }

        const mockResponse = {
          id: Math.floor(Math.random() * 1000),
          ...categorieObject,
          photos: categorieObject.photos ? categorieObject.photos.map((_, i) => `mock-photo-url-${i}.jpg`) : [],
          createdAt: new Date().toISOString()
        };
        console.log('Mock response:', mockResponse);
        resolve(mockResponse);
      }, 1000);
    });
  }, []);

  const verifyAdmin = useCallback((matricule, password) => {
    try {
      return (
        String(matricule) === ADMIN_ACCOUNT.matricule &&
        String(password) === ADMIN_ACCOUNT.password
      );
    } catch {
      return false;
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    managers,
    servers,
    restaurants,
    foods,
    categories,
    login,
    logout,
    addManager,
    addServer,
    addRestaurant,
    addFood,
    addCategorie,
    verifyAdmin
  }), [user, managers, servers, restaurants, foods,categories, login, logout, addManager, addServer, addRestaurant, addFood,addCategorie, verifyAdmin]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};