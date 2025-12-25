/**
 * Create/Edit Blog Post Page
 * For doctors to write or edit articles
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiImage, FiX } from 'react-icons/fi';
import { blogService } from '../services/blogService';
import Navbar from '../components/Navbar';

const CreateBlogPostPage = () => {
  const { id } = useParams(); // If id exists, we're editing
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_published: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const isEditMode = !!id;

  useEffect(() => {
    // Check if user is a doctor
    if (!user || user.role !== 'DOCTOR') {
      navigate('/doctors-advice');
      return;
    }

    // If editing, fetch the post
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setFetchingPost(true);
      const post = await blogService.getPost(id);
      
      // Check if user is the author
      if (post.author !== user.id) {
        alert('You can only edit your own articles');
        navigate('/doctors-advice');
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        is_published: post.is_published
      });
      
      if (post.image) {
        setExistingImage(post.image);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load article');
    } finally {
      setFetchingPost(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImage(null); // Remove existing image if new one is selected
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('is_published', formData.is_published);
      
      if (image) {
        submitData.append('image', image);
      }

      if (isEditMode) {
        await blogService.updatePost(id, submitData);
      } else {
        await blogService.createPost(submitData);
      }

      navigate('/doctors-advice');
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.response?.data?.message || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/doctors-advice')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to articles
        </button>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {isEditMode ? 'Edit Article' : 'Write New Article'}
          </h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter an engaging title for your article"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={10}
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your medical advice, health tips, or insights..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="15"
                required
                minLength={50}
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 50 characters
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image (Optional)
              </label>
              
              {(imagePreview || existingImage) && (
                <div className="relative mb-4">
                  <img
                    src={imagePreview || `http://localhost:8000${existingImage}`}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                  <FiImage className="w-5 h-5" />
                  <span>{image ? 'Change Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {image && (
                  <span className="text-sm text-gray-600">{image.name}</span>
                )}
              </div>
            </div>

            {/* Publish Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                Publish immediately
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-5 h-5" />
                {loading ? 'Saving...' : isEditMode ? 'Update Article' : 'Publish Article'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/doctors-advice')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPostPage;
