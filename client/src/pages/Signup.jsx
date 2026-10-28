import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../services/firebase';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        avatar: avatar || 'https://picsum.photos/seed/picsum/200/300',
      });

      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  const handleGoogleSignup = async (e) => {
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
      setError(err.message || err.response?.data?.message || 'Google signup failed');
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2 className="purple-heading">Sign Up</h2>

        {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
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
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Avatar (optional)</label>
            <input
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              className="form-input"
              onChange={handleAvatarChange}
            />
          </div>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="btn-google"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
