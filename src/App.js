import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage            from './pages/Login';
import ManagerDashboard     from './pages/ManagerDashboard';
import InventoryViewPage    from './pages/Inventory';
import ForcastPage          from './pages/Forcast';
import ItemForecastByMonth  from './pages/ItemForecastByMonth';
import ForecastSelector     from './pages/ForecastSelector';
import Navbar               from './pages/Navbar'; // ✅ עכשיו מתוך pages

function App() {
  console.log("🔥 App component is rendering");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                      element={<LoginPage />} />
        <Route path="/dashboard"             element={<ManagerDashboard />} />
        <Route path="/inventory"             element={<InventoryViewPage />} />
        <Route path="/forcast"               element={<ForcastPage />} />
        <Route path="/consumption-last-year" element={<ItemForecastByMonth />} />
        <Route path="/forecast-selector"     element={<ForecastSelector />} />
      </Routes>
    </>
  );
}

export default App;
