import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import PlantHealth from './pages/PlantHealth';
import MarketTrends from './pages/MarketTrends';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Bulb from './components/bulb';

localStorage.removeItem('token');

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-white text-black dark:bg-[#181825] dark:text-white transition-colors duration-500">
      {/* Pro glassy background for light/dark mode */}
      <div className="fixed inset-0 z-0 transition-colors duration-700">
        {/* Base background: white for light, black for dark */}
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-[#181825] transition-colors duration-700" />
        {/* Soft vignette for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 dark:from-black/10 dark:via-black/30 dark:to-black/80 transition-colors duration-700 pointer-events-none" />
      </div>
      <Bulb />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="flex-1 p-0 ml-0 relative z-10">
                <Navbar />
                <Home />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/crop-recommendation"
          element={
            <ProtectedRoute>
              <div className="flex-1 p-0 ml-0 relative z-10">
                <Navbar />
                <CropRecommendation />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plant-health"
          element={
            <ProtectedRoute>
              <div className="flex-1 p-0 ml-0 relative z-10">
                <Navbar />
                <PlantHealth />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/market-trends"
          element={
            <ProtectedRoute>
              <div className="flex-1 p-0 ml-0 relative z-10">
                <Navbar />
                <MarketTrends />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="flex-1 p-0 ml-0 relative z-10">
                <Navbar />
                <Profile />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Login />} /> {/* Add register route */}
        <Route path="*" element={<Navigate to="/login" replace />} /> {/* Catch-all */}
      </Routes>
    </div>
  );
}

export default App;