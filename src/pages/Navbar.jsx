// src/pages/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'admin') return null;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* קישורים עם מפרידים */}
        <div className="flex items-center text-gray-800 font-medium text-sm md:text-base">
          <Link to="/dashboard" className="hover:text-blue-600 transition">📊 דאשבורד</Link>
          <span className="px-3 text-gray-300">|</span>
          <Link to="/inventory" className="hover:text-blue-600 transition">📦 מלאי</Link>
          <span className="px-3 text-gray-300">|</span>
          <Link to="/forecast-selector" className="hover:text-blue-600 transition">📈 חיזויים</Link>
        </div>

        {/* מידע על המשתמש והתנתקות */}
        <div className="flex items-center gap-4 text-sm md:text-base">
          <span className="text-gray-600">👤 ברוך הבא, <strong>{user.role}</strong></span>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 transition font-semibold"
          >
            ⎋ התנתקות
          </button>
        </div>

      </div>
    </nav>
  );
}
