import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Blog App
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
