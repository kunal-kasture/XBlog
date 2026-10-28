import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/me/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch user posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="page-title" style={{ margin: 0 }}>
          My Posts
        </h1>
        <button
          type="submit"
          className="btn-create-post"
          onClick={() => navigate('/create')}
        >
          + Create Post
        </button>
      </div>

      {loading ? (
        <p className="empty-text">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">You have no posts yet.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <img
                src={post.image || 'https://picsum.photos/seed/picsum/200/300'}
                alt={post.title}
                className="post-card-image"
              />

              <div className="post-card-body">
                <h3 className="post-card-title" style={{ color: '#ffffff' }}>
                  {post.title}
                </h3>

                <div className="post-stats" style={{ marginBottom: '16px' }}>
                  <span>❤️ {post.likes ? post.likes.length : 0}</span>
                  <span>|</span>
                  <span>💬 {post.comments ? post.comments.length : 0}</span>
                </div>

                <div className="action-buttons">
                  <button
                    type="submit"
                    className="btn-action-view"
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    View
                  </button>
                  <button
                    type="submit"
                    className="btn-action-edit"
                    onClick={() => navigate(`/edit/${post._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    type="submit"
                    className="btn-action-delete"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
