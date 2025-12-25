/**
 * Doctor's Advice Page
 * Displays all blog posts from doctors with inline comments (Facebook style)
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiMessageSquare, FiCalendar, FiUser, FiEdit, FiSend, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { blogService } from '../services/blogService';
import Navbar from '../components/Navbar';

const DoctorAdvicePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    // Check which posts the user has already commented on
    // Only run when blogPosts changes (not filteredPosts to avoid lag)
    if (blogPosts.length > 0 && user) {
      const editingState = {};
      const newCommentsState = {};
      const userId = user.user_id || user.id; // Support both user_id and id
      
      blogPosts.forEach(post => {
        const userComment = post.comments?.find(comment => comment.author === userId);
        if (userComment) {
          editingState[post.id] = userComment;
          newCommentsState[post.id] = userComment.content;
        }
      });
      
      setEditingComments(editingState);
      setNewComments(prev => ({ ...prev, ...newCommentsState }));
    }
  }, [blogPosts, user?.user_id, user?.id]);

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

  const handleEditPost = (postId, e) => {
    e.stopPropagation();
    navigate(`/doctors-advice/edit/${postId}`);
  };

  const handleDeletePost = async (postId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await blogService.deletePost(postId);
      // Refresh posts
      const updatedPosts = blogPosts.filter(p => p.id !== postId);
      setBlogPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete article');
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleSubmitComment = async (postId, e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment');
      return;
    }
    
    const commentText = newComments[postId];
    if (!commentText?.trim()) return;

    const isEditing = editingComments[postId];

    try {
      setSubmittingComment(prev => ({ ...prev, [postId]: true }));
      const response = await blogService.createComment({
        blog_post: postId,
        content: commentText
      });
      
      // Update editing state with the new/updated comment
      if (response) {
        setEditingComments(prev => ({
          ...prev,
          [postId]: response
        }));
      }
      
      // Refresh posts to get updated comments
      fetchBlogPosts();
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert(isEditing ? 'Failed to update comment' : 'Failed to post comment');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (commentId, postId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await blogService.deleteComment(commentId);
      // Refresh posts
      fetchBlogPosts();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    }
  };

  const handleViewCount = async (postId) => {
    try {
      await blogService.incrementViews(postId);
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  const toggleMenu = (postId, e) => {
    e.stopPropagation();
    setShowMenu(prev => {
      // Close all other menus and toggle this one
      const newState = {};
      newState[postId] = !prev[postId];
      return newState;
    });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu({});
    };
    
    if (Object.keys(showMenu).some(key => showMenu[key])) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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
          <div className="max-w-2xl mx-auto space-y-6">
            {filteredPosts.map((post) => {
              // Ensure type consistency for comparison
              // Note: localStorage stores 'user_id', not 'id'
              const userId = user?.user_id ? Number(user.user_id) : (user?.id ? Number(user.id) : null);
              const authorId = post.author ? Number(post.author) : null;
              const isAuthor = userId === authorId;
              const commentsExpanded = expandedComments[post.id];
              const displayedComments = commentsExpanded ? post.comments : post.comments.slice(0, 2);

              // Debug logging
              console.log('Post ID:', post.id, '| User ID:', userId, '| Author ID:', authorId, '| isAuthor:', isAuthor);

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3">
                          <FiUser className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            Dr. {post.author_name}
                          </h3>
                          {post.author_specialization && (
                            <p className="text-sm text-gray-600">{post.author_specialization}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Menu - Only for author */}
                      {/* Always show for testing - will remove after fix */}
                      <div className="relative">
                        <button
                          onClick={(e) => toggleMenu(post.id, e)}
                          className={`p-2 hover:bg-gray-100 rounded-full transition ${!isAuthor ? 'opacity-30' : ''}`}
                          title={isAuthor ? 'Your post' : `Not your post (User:${userId} vs Author:${authorId})`}
                        >
                          <FiMoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {showMenu[post.id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                            <button
                              onClick={(e) => handleEditPost(post.id, e)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <FiEdit className="w-4 h-4" />
                              Edit Article
                            </button>
                            <button
                              onClick={(e) => handleDeletePost(post.id, e)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete Article
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div 
                    onClick={() => {
                      handleViewCount(post.id);
                      handlePostClick(post.id);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Post Title */}
                    <div className="px-4 pt-4">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {post.title}
                      </h2>
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className="w-full">
                        <img
                          src={post.image.startsWith('http') ? post.image : `http://localhost:8000${post.image}`}
                          alt={post.title}
                          className="w-full h-auto object-cover max-h-96"
                        />
                      </div>
                    )}

                    {/* Post Text Content */}
                    <div className="px-4 py-3">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {post.content.length > 300 
                          ? `${post.content.substring(0, 300)}... `
                          : post.content}
                      </p>
                      {post.content.length > 300 && (
                        <button className="text-blue-600 hover:text-blue-800 font-semibold mt-1">
                          Read more
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Stats */}
                  <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        <span>{post.views_count} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMessageSquare className="w-4 h-4" />
                      <span>{post.comments_count} comments</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-gray-200">
                    {/* Comment Input */}
                    {user && (
                      <form onSubmit={(e) => handleSubmitComment(post.id, e)} className="p-4 border-b border-gray-200">
                        <div className="flex gap-3">
                          <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
                            <FiUser className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            {editingComments[post.id] && (
                              <div className="text-xs text-blue-600 mb-1 px-4">
                                Editing your comment
                              </div>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newComments[post.id] || ''}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                placeholder={editingComments[post.id] ? "Edit your comment..." : "Write a comment..."}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                type="submit"
                                disabled={submittingComment[post.id] || !newComments[post.id]?.trim()}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => e.stopPropagation()}
                                title={editingComments[post.id] ? "Update comment" : "Post comment"}
                              >
                                {editingComments[post.id] ? <FiEdit className="w-4 h-4" /> : <FiSend className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="px-4 py-3">
                        <div className="space-y-3">
                          {displayedComments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="bg-gray-200 rounded-full p-2 flex-shrink-0 h-fit">
                                <FiUser className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {comment.author_name}
                                      {comment.author_role === 'DOCTOR' && (
                                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                          Doctor
                                        </span>
                                      )}
                                    </p>
                                    {user?.id === comment.author && (
                                      <button
                                        onClick={(e) => handleDeleteComment(comment.id, post.id, e)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Delete comment"
                                      >
                                        <FiTrash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-gray-700 text-sm">{comment.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-3">
                                  {new Date(comment.created_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* View More/Less Comments Button */}
                        {post.comments.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComments(post.id);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-3 ml-12"
                          >
                            {commentsExpanded 
                              ? 'View less comments' 
                              : `View all ${post.comments.length} comments`}
                          </button>
                        )}
                      </div>
                    )}

                    {/* No comments message */}
                    {post.comments && post.comments.length === 0 && !user && (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No comments yet. Log in to be the first to comment!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAdvicePage;
