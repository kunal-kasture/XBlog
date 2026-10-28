import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPostAndComments = async () => {
    try {
      const postRes = await api.get(`/posts/${id}`);
      setPost(postRes.data);

      const commentsRes = await api.get(`/posts/${id}/comments`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('Failed to load post details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to like posts');

    try {
      const res = await api.post(`/posts/${id}/like`);
      setPost((prev) => ({
        ...prev,
        likedByCurrentUser: !prev.likedByCurrentUser,
        totalLikes: res.data.totalLikes,
        likes: prev.likedByCurrentUser
          ? prev.likes.filter((uid) => uid !== user._id && uid !== user.id)
          : [...(prev.likes || []), user._id || user.id],
      }));
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) return alert('Please login to add comments');

    try {
      const res = await api.post(`/posts/${id}/comments`, {
        text: commentText.trim(),
      });

      const newComment = {
        ...res.data,
        author: {
          _id: user._id || user.id,
          name: user.name,
          email: user.email,
        },
      };

      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container">
        <p className="empty-text">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <p className="empty-text">Post not found.</p>
      </div>
    );
  }

  const isLiked = post.likedByCurrentUser;
  const likesCount = post.totalLikes ?? (post.likes ? post.likes.length : 0);

  return (
    <div className="container">
      <div className="post-detail-card">
        <h1 className="post-detail-title">{post.title}</h1>

        <img
          src={post.image || 'https://picsum.photos/seed/picsum/200/300'}
          alt={post.title}
          className="post-detail-banner"
        />

        <p className="post-detail-content">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="tags-row">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          type="submit"
          className={isLiked ? 'btn-like-filled' : 'btn-like-outline'}
          onClick={handleLikeToggle}
        >
          {isLiked ? `Unlike (${likesCount})` : `Like (${likesCount})`}
        </button>

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>

          <form onSubmit={handleAddComment} className="comment-input-row">
            <input
              type="text"
              name="comment"
              placeholder="Add a comment..."
              className="form-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn-add-comment">
              Add Comment
            </button>
          </form>

          <div style={{ marginTop: '20px' }}>
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div>
                  <span className="comment-author-name">
                    {comment.author?.name || 'Anonymous'}
                  </span>
                  <span className="comment-time">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
