import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LoginPage           from './pages/Login'
import ManagerDashboard    from './pages/ManagerDashboard'
import ScanPage            from './pages/Scanpage'
import InventoryViewPage   from './pages/Inventory'
import ExpiredPage         from './pages/Expiredpage'
import ForcastPage         from './pages/Forcast'
import ItemForecastByMonth from './pages/ItemForecastByMonth'

function App() {
  console.log("🔥 App component is rendering")

  return (
    <Routes>
      <Route path="/"                      element={<LoginPage />} />
      <Route path="/dashboard"             element={<ManagerDashboard />} />
      <Route path="/scan"                  element={<ScanPage />} />
      <Route path="/inventory"             element={<InventoryViewPage />} />
      <Route path="/expired"               element={<ExpiredPage />} />
      <Route path="/forcast"               element={<ForcastPage />} />
      <Route path="/consumption-last-year" element={<ItemForecastByMonth />} />
    </Routes>
  )
}

export default App
