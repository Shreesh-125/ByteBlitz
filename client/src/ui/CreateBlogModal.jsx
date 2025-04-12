// ui/CreateBlogModal.jsx
import React, { useState } from 'react';
import styles from '../styles/Admin.module.css';

const CreateBlogModal = ({ show, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tags</label>
            <div className={styles.tagInputContainer}>
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
              />
              <button 
                type="button" 
                onClick={handleAddTag}
                className={styles.addTagButton}
              >
                Add
              </button>
            </div>
            <div className={styles.tagsContainer}>
              {formData.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.removeTag}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.modalButtons}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogModal;