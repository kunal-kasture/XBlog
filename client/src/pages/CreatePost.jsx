import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      await api.post('/posts', {
        title,
        content,
        tags: parsedTags,
        image: image || 'https://picsum.photos/seed/picsum/200/300',
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="container">
      <div className="wide-form-card">
        <h2 className="purple-heading" style={{ textAlign: 'left' }}>
          Create Post
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
                  alt="Preview"
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
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
