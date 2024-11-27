import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navigation from './components/Navigation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <div className="flex">
              <Navigation />
              <div className="flex-1">
                <Home />
              </div>
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <div className="flex">
              <Navigation />
              <div className="flex-1">
                <Profile />
              </div>
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <div className="flex">
              <Navigation />
              <div className="flex-1">
                <Feed />
              </div>
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <div className="flex">
              <Navigation />
              <div className="flex-1">
                <AdminDashboard />
              </div>
            </div>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <div className="flex">
              <Navigation />
              <div className="flex-1">
                <UserManagement />
              </div>
            </div>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;