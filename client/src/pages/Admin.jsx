import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch all posts for admin', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Failed to delete post as admin', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="container">
      <div className="wide-form-card" style={{ maxWidth: '1000px' }}>
        <h2 className="purple-heading" style={{ textAlign: 'left' }}>
          Admin Panel – All Posts
        </h2>

        {loading ? (
          <p className="empty-text">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="empty-text">No posts available.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Likes</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>{post.author?.name || 'Unknown'}</td>
                    <td>{post.likes ? post.likes.length : 0}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
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
                          className="btn-action-delete"
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
