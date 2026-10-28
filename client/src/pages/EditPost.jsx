import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
        setTags(res.data.tags ? res.data.tags.join(', ') : '');
        setCurrentImage(res.data.image || '');
        setImage(res.data.image || '');
      } catch (err) {
        setError('Failed to load post');
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const parsedTags = tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await api.put(`/posts/${id}`, {
        title,
        content,
        tags: parsedTags,
        image: image || currentImage,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  return (
    <div className="container">
      <div className="wide-form-card">
        <h2 className="purple-heading" style={{ textAlign: 'left' }}>
          Edit Post
        </h2>

        {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              name="tags"
              className="form-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {currentImage && !preview && (
            <div className="form-group">
              <label>Current Image</label>
              <div>
                <img
                  src={currentImage}
                  alt="Current"
                  style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              className="form-input"
              onChange={handleImageChange}
            />
            {preview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={preview}
                  alt="New preview"
                  style={{ maxHeight: '180px', borderRadius: '6px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
