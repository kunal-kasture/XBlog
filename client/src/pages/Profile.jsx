import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
      setName(res.data.name || '');
      setAvatar(res.data.avatar || '');
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await api.put('/users/me', {
        name,
        avatar: avatar || profile?.avatar,
      });

      setProfile((prev) => ({ ...prev, ...res.data }));
      updateUser(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const displayName = profile?.name || user?.name || '';
  const displayEmail = profile?.email || user?.email || '';
  const displayAvatar =
    avatar || profile?.avatar || user?.avatar || 'https://picsum.photos/seed/picsum/200/300';
  const postCount = profile?.postCount ?? 0;

  return (
    <div className="container">
      <div className="profile-card">
        <img src={displayAvatar} alt="Avatar" className="profile-avatar" />
        <h2 className="profile-name">{displayName}</h2>
        <p className="profile-email">{displayEmail}</p>
        <p className="profile-posts-count">Total Posts: {postCount}</p>

        <hr className="profile-divider" />

        {message && (
          <div style={{ color: '#10b981', marginBottom: '16px' }}>{message}</div>
        )}

        <form onSubmit={handleUpdate} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Avatar</label>
            <input
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              className="form-input"
              onChange={handleAvatarChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
