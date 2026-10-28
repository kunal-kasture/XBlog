import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../services/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const googleUser = await signInWithGoogle();

      const res = await api.post('/auth/google-login', {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        role: googleUser.role || 'user',
      });

      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2 className="purple-heading">Login</h2>

        {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn-google"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
