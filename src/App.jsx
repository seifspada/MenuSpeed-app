import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Login from './components/Login';
import HomeAdmin from './components/admin/homeAdmin';
import HomeManager from './components/manager/homeManager';
import AddManager from './components/admin/addManager';
import ManagerList from './components/admin/managerList';
import ManagerInformation from './components/admin/managerInformation';
import UpdateManager from './components/admin/updateManager';
import RestaurantManagement from './components/manager/restaurantManagement';
import ServerManagement from './components/manager/serverManagement';
import AddServer from './components/manager/addServer';
import ServerInformation from './components/manager/serverInformation';
import AddRestaurant from './components/manager/addRestaurant';
import UpdateServer from './components/manager/updateServer';
import UpdateRestaurant from './components/manager/updateRestaurant';
import RestaurantInformation from './components/manager/restaurantInformation';
import FoodManagement from './components/manager/foodManagement';
import AddFood from './components/manager/addFood';
import OptionInterface from './components/OptionInterface';
import FoodInformation from './components/manager/foodInformation';
import UpdateFood from './components/manager/updateFood';
import { Description } from '@mui/icons-material';
import CategorieManagement from './components/manager/categorieManagement';
import UpdateCategorie from './components/manager/updateCategorie';
import CategorieInformation from './components/manager/categorieInformation';
import AddCategorie from './components/manager/addCategorie';
function App() {
  // États initiaux
  const [managers, setManagers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      cin: '12345678',
      phone: '2222',
      matricule: 'Bruschetta123', 
      password: 'Bruschetta123', 
      role: 'manager'
    }
  ]);

  const [servers, setServers] = useState([
    { 
      id: 1, 
      name: 'salii', 
      phone: '2222',
      matricule: 'Bruschetta123', 
      password: 'Bruschetta123', 
      role: 'server',
      restaurantId: 1 // Ajouté pour associer au restaurant
    },
    { 
      id: 2, 
      name: 'saloo', 
      phone: '2222',
      matricule: '180degree', 
      password: '180degree', 
      role: 'server',
      restaurantId: 1 // Ajouté pour associer au restaurant
    }
  ]);

  const [restaurants, setRestaurants] = useState([
    { 
      id: 1, 
      name: 'SpaceX',
      tableNumber: 45,
      address: '123 Main St', 
      phone: '555-1234', 
      mapsLink: 'https://maps.example.com',
      photoUrl: null,
      createdAt: new Date().toISOString()
    }
  ]);

  const [foods, setFoods] = useState([
    { 
      id: 1, 
      name: 'Pizza Margherita', 
      price: 12.99, 
      description: "Description du plat...",
      restaurantId: 1,
      photos: ['../../assets/background.png'], // Maintenant un tableau
      categoryId: "1"
    }
  ]);
  const [categories, setCategories] = useState([
    { 
      id: "1", // ou un nombre, selon ton système
      name: "Pâtes",
      photo: "./assets/background.png"
    }
  ]);

  const generateId = (array) => {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
  };

  const handleAddRestaurant = (newRestaurant) => {
    console.log('Nouveau restaurant avant traitement:', newRestaurant);
    let photoUrl = '';
    if (newRestaurant.photoUrl instanceof File) {
      photoUrl = URL.createObjectURL(newRestaurant.photoUrl);
    } else if (typeof newRestaurant.photoUrl === 'string') {
      photoUrl = newRestaurant.photoUrl;
    }

    const restaurantWithId = {
      ...newRestaurant,
      id: generateId(restaurants),
      tableNumber: parseInt(newRestaurant.tableNumber) || 0,
      photoUrl: photoUrl,
      createdAt: new Date().toISOString()
    };
    setRestaurants(prev => [...prev, restaurantWithId]);
  };

 // Dans App.js
const handleAddFood = (newFood) => {
  console.log('Nouveau Food avant traitement:', newFood);
  const photoUrls = newFood.photos.map(photo => 
    photo instanceof File ? URL.createObjectURL(photo) : photo
  );
  const foodWithId = {
    ...newFood,
    id: generateId(foods),
    photos: photoUrls,
    restaurantId: parseInt(newFood.restaurantId),
    createdAt: new Date().toISOString()
  };
  setFoods(prev => [...prev, foodWithId]);
};
  const handleAddManager = (newManager) => {
    const managerWithId = {
      ...newManager,
      id: generateId(managers)
    };
    setManagers(prev => [...prev, managerWithId]);
  };

  const handleAddServer = (newServer) => {
    const serverWithId = {
      ...newServer,
      id: generateId(servers),
      restaurantId: newServer.restaurantId || parseInt(newServer.restaurantId) // Assurer restaurantId
    };
    setServers(prev => [...prev, serverWithId]);
  };

  const deleteManager = (managerId) => {
    setManagers(prev => prev.filter(manager => manager.id !== managerId));
  };

  const handleAddCategorie = (newCategorie) => {
    console.log('Nouveau Categorie avant traitement:', newCategorie);
    let photoUrl = '';
    if (newCategorie.photoUrl instanceof File) {
      photoUrl = URL.createObjectURL(newCategorie.photoUrl);
    } else if (typeof newCategorie.photoUrl === 'string') {
      photoUrl = newCategorie.photoUrl;
    }

    const categorieWithId = {
      ...newCategorie,
      id: generateId(Categories),
      photoUrl: photoUrl,
      restaurantId: newCategorie.restaurantId || parseInt(newCategorie.restaurantId), // Assurer restaurantId
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, categorieWithId]);
  };


  const deleteServer = (serverId) => {
    setServers(prev => prev.filter(server => server.id !== serverId));
  };

  const deleteRestaurant = (restaurantId) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== restaurantId));
    // Optionnel : Supprimer les serveurs et plats associés
    setServers(prev => prev.filter(server => server.restaurantId !== restaurantId));
    setFoods(prev => prev.filter(food => food.restaurantId !== restaurantId));
  };

  const deleteFood = (foodId) => {
    setFoods(prev => prev.filter(food => food.id !== foodId));
  };
  const deleteCategorie = (categorieId) => {
    setCategories(prev => prev.filter(categorie => categorie.id !== categorieId));
  };
  const handleUpdateManager = (updatedManager) => {
    setManagers(prev => prev.map(manager => 
      manager.id === updatedManager.id ? updatedManager : manager
    ));
  };

  const handleUpdateServer = (updatedServer) => {
    setServers(prev => prev.map(server => 
      server.id === updatedServer.id ? updatedServer : server
    ));
  };

  const handleUpdateRestaurant = (updatedRestaurant) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
    ));
  };

  const handleUpdateFood = (updatedFood) => {
    setFoods(prev => prev.map(food => 
      food.id === updatedFood.id ? updatedFood : food
    ));
  };
  const handleUpdateCategorie = (updatedCategorie) => {
    setCategories(prev => prev.map(categorie => 
      categorie.id === updatedCategorie.id ? updatedCategorie : categorie
    ));
  };

  return (
    <AuthProvider 
      initialManagers={managers} 
      initialServers={servers}
      initialRestaurants={restaurants}
      initialFoods={foods}
      initialCategories={categories}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Routes Admin */}
          <Route path="/login/homeAdmin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HomeAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeAdmin/addManager" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddManager onAddManager={handleAddManager}/>
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeAdmin/managerList" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManagerList managers={managers}/>
            </ProtectedRoute>
          } />
          
          <Route 
  path="/login/homeAdmin/managerOption/:managerId" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <OptionInterface 
        entityType="manager"
        deleteFunction={deleteManager}
        backPath="/login/homeAdmin" 
        infoPath="/login/homeAdmin/managerList/managerOption/:managerId/managerInformation/" 
        updatePath="/login/homeAdmin/managerList/managerOption/:managerId/updateManager" 
      />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/login/homeAdmin/managerList/managerOption/:managerId/managerInformation/" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <ManagerInformation managers={managers} restaurants={restaurants} redirectPath="/managerOption/:managerId" />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/login/homeAdmin/managerList/managerOption/:managerId/updateManager" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UpdateManager managers={managers} onUpdateManager={handleUpdateManager} redirectPath="/managerOption/:managerId" />
    </ProtectedRoute>
  } 
/>
          {/* Routes Manager */}
          <Route path="/login/homeManager" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <HomeManager restaurants={restaurants} />
            </ProtectedRoute>
          } />
          <Route path="/login/homeManager/addRestaurant" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <AddRestaurant onAddRestaurant={handleAddRestaurant} />
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeManager/restaurantManagement/:restaurantId" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <RestaurantManagement restaurants={restaurants} />
            </ProtectedRoute>
          } />

              {/* Route pour Restaurant */}
              <Route 
            path="/login/homeManager/restaurantManagement/:restaurantId/restaurantOption" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <OptionInterface 
                  entityType="restaurant"
                  deleteFunction={deleteRestaurant}
                  backPath="/login/homeManager/restaurantManagement/:restaurantId"
                  infoPath="/login/homeManager/restaurantManagement/:restaurantId/restaurantInformation" 
                  updatePath="/login/homeManager/restaurantManagement/:restaurantId/updateRestaurant" 
                />
              </ProtectedRoute>
            } 
          />

<Route path="/login/homeManager/restaurantManagement/:restaurantId/updateRestaurant" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <UpdateRestaurant restaurants={restaurants} onUpdateRestaurant={handleUpdateRestaurant} />
            </ProtectedRoute>
          } />

          <Route path="/login/homeManager/restaurantManagement/:restaurantId/restaurantInformation" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <RestaurantInformation managers={managers} restaurants={restaurants} />
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/serverManagement" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ServerManagement servers={servers} />
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/serverManagement/addServer" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <AddServer onAddServer={handleAddServer} />
            </ProtectedRoute>
          } />
          {/* Route pour Server */}
          <Route 
            path="/login/homeManager/restaurantManagement/:restaurantId/serverManagement/serverOption/:serverId" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <OptionInterface 
                  entityType="server"
                  deleteFunction={deleteServer}
                  backPath="/login/homeManager/restaurantManagement/:restaurantId/serverManagement"
                  infoPath="/login/homeManager/restaurantManagement/:restaurantId/serverManagement/serverOption/:serverId/serverInformation" 
                  updatePath="/login/homeManager/restaurantManagement/:restaurantId/serverManagement/serverOption/:serverId/updateServer"
                />
                
              </ProtectedRoute>
            } 
          />
          
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/serverManagement/serverOption/:serverId/serverInformation" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ServerInformation servers={servers} />
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/serverManagement/serverOption/:serverId/updateServer" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <UpdateServer servers={servers} onUpdateServer={handleUpdateServer} />
            </ProtectedRoute>
          } />
          
          
          

        

          <Route path="/login/homeManager/restaurantManagement/:restaurantId/foodManagement" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <FoodManagement foods={foods} />
            </ProtectedRoute>
          } />
          
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/foodManagement/addFood" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <AddFood categories={categories} onAddFood={handleAddFood} />
            </ProtectedRoute>
          } />

          

      

          {/* Route pour Food */}
          <Route 
            path="/login/homeManager/restaurantManagement/:restaurantId/foodManagement/foodOption/:foodId" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <OptionInterface 
                  entityType="food"
                  deleteFunction={deleteFood}
                  backPath="/login/homeManager/restaurantManagement/:restaurantId/foodManagement"
                  infoPath="/login/homeManager/restaurantManagement/:restaurantId/foodManagement/foodOption/:foodId/foodInformation" 
                  updatePath="/login/homeManager/restaurantManagement/:restaurantId/foodManagement/foodOption/:foodId/updateFood" 
                />
              </ProtectedRoute>
            } 
          />
         <Route path="/login/homeManager/restaurantManagement/:restaurantId/foodManagement/foodOption/:foodId/foodInformation" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <FoodInformation foods={foods} />
            </ProtectedRoute>
          } />
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/foodManagement/foodOption/:foodId/updateFood/" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <UpdateFood foods={foods} onUpdateFood={handleUpdateFood} />
            </ProtectedRoute>
          } />

        <Route path="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <CategorieManagement categories={categories} />
            </ProtectedRoute>
          } />

        <Route path="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement/addCategorie" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <AddCategorie categories={categories} onAddFood={handleAddCategorie} />
            </ProtectedRoute>
          } />


          <Route 
            path="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement/categorieOption/:categorieId" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <OptionInterface 
                  entityType="categorie"
                  deleteFunction={deleteCategorie}
                  backPath="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement"
                  infoPath="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement/categorieOption/:categorieId/categorieInformation" 
                  updatePath="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement/categorieOption/:categorieId/updateCategorie"
                />
              </ProtectedRoute>
            } 
          />
          <Route path="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement/categorieOption/:categorieId/categorieInformation" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <CategorieInformation categories={categories} 
              
              />
            </ProtectedRoute>
          } />

        <Route path="/login/homeManager/restaurantManagement/:restaurantId/categorieManagement/categorieOption/:categorieId/updateCategorie/" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <UpdateCategorie categories={categories} onUpdateFood={handleUpdateCategorie} />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;