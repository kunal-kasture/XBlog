import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (tags.trim()) params.tags = tags.trim();

      const res = await api.get('/posts', { params });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, tags]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="container">
      <h1 className="page-title">Explore Posts</h1>

      <div className="search-bar-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Filter by tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="empty-text">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">No posts found.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-card-header">
                <span>{post.author?.name || 'Anonymous'}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>

              <img
                src={post.image || 'https://picsum.photos/seed/picsum/200/300'}
                alt={post.title}
                className="post-card-image"
              />

              <div className="post-card-body">
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-snippet">
                  {post.content && post.content.length > 80
                    ? `${post.content.substring(0, 80)}...`
                    : post.content}
                </p>

                <div className="post-card-footer">
                  <button
                    type="submit"
                    className="btn-read-more"
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    Read More
                  </button>

                  <div className="post-stats">
                    <span>❤️ {post.likes ? post.likes.length : 0}</span>
                    <span>💬 {post.comments ? post.comments.length : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
