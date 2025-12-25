/**
 * Doctor's Advice Page
 * Displays all blog posts from doctors
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiMessageSquare, FiCalendar, FiUser, FiEdit } from 'react-icons/fi';
import { blogService } from '../services/blogService';
import Navbar from '../components/Navbar';

const DoctorAdvicePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    // Filter posts based on search query
    if (searchQuery.trim()) {
      const filtered = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(blogPosts);
    }
  }, [searchQuery, blogPosts]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllPosts();
      setBlogPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/doctors-advice/${postId}`);
  };

  const handleCreatePost = () => {
    navigate('/doctors-advice/create');
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Doctor's Advice
              </h1>
              <p className="text-gray-600 mt-2">
                Health tips and medical advice from our expert doctors
              </p>
            </div>
            
            {/* Create Post Button - Only for doctors */}
            {user?.role === 'DOCTOR' && (
              <button
                onClick={handleCreatePost}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl"
              >
                <FiEdit className="w-5 h-5" />
                Write Article
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles by title, content, or doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No articles found' : 'No articles yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try different search terms'
                : user?.role === 'DOCTOR'
                ? 'Be the first to share your medical advice!'
                : 'Check back soon for expert advice from our doctors'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                {/* Image */}
                {post.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`http://localhost:8000${post.image}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateContent(post.content)}
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FiUser className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Dr. {post.author_name}</p>
                      {post.author_specialization && (
                        <p className="text-sm text-gray-500">{post.author_specialization}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        <span>{post.views_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMessageSquare className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAdvicePage;
