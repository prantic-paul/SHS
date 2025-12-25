/**
 * Blog Post Detail Page
 * Displays single blog post with comments
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEye, FiMessageSquare, FiCalendar, FiUser, FiArrowLeft, FiTrash2, FiEdit2, FiSend } from 'react-icons/fi';
import { blogService } from '../services/blogService';
import Navbar from '../components/Navbar';

const BlogPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPostAndComments();
    // Increment view count
    blogService.incrementViews(id).catch(console.error);
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        blogService.getPost(id),
        blogService.getComments(id)
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await blogService.createComment({
        blog_post: parseInt(id),
        content: newComment
      });
      setNewComment('');
      // Refresh comments
      const updatedComments = await blogService.getComments(id);
      setComments(updatedComments);
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await blogService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await blogService.deletePost(id);
      navigate('/doctors-advice');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete article');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Blog post not found'}
          </div>
          <button
            onClick={() => navigate('/doctors-advice')}
            className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <FiArrowLeft /> Back to articles
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.author;

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

        {/* Article */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.image && (
            <img
              src={`http://localhost:8000${post.image}`}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    Dr. {post.author_name}
                  </p>
                  {post.author_specialization && (
                    <p className="text-gray-600">{post.author_specialization}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/doctors-advice/edit/${post.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit article"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete article"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                <span>{post.views_count} views</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMessageSquare className="w-5 h-5" />
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                required
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              Please log in to comment on this article.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 rounded-full p-2">
                        <FiUser className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {comment.author_name}
                          {comment.author_role === 'DOCTOR' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Doctor
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </div>

                    {user?.id === comment.author && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete comment"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 ml-11">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetailPage;
