import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Dashboard from './pages/Dashboard';
import MeetupReview from './pages/MeetupReview';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';

function AppRoutes() {
  const { token, mustChangePassword, logout } = useAuth();

  if (!token) return <Login />;

  if (mustChangePassword) return <ChangePassword />;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">MeetRun Admin</span>
          <Link to="/" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link to="/review" className="text-gray-600 hover:text-blue-600">Review Meetups</Link>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">
          Sign out
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/review" element={<MeetupReview />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
