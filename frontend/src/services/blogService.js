import apiClient from './api';

export const blogService = {
  // Get all blog posts
  async getAllPosts() {
    const response = await apiClient.get('/blog/posts/');
    return response.data;
  },

  // Get single blog post
  async getPost(id) {
    const response = await apiClient.get(`/blog/posts/${id}/`);
    return response.data;
  },

  // Create new blog post (doctors only)
  async createPost(data) {
    const response = await apiClient.post('/blog/posts/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update blog post
  async updatePost(id, data) {
    const response = await apiClient.patch(`/blog/posts/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete blog post
  async deletePost(id) {
    const response = await apiClient.delete(`/blog/posts/${id}/`);
    return response.data;
  },

  // Get my posts (current doctor's posts)
  async getMyPosts() {
    const response = await apiClient.get('/blog/posts/my_posts/');
    return response.data;
  },

  // Increment view count
  async incrementViews(id) {
    const response = await apiClient.post(`/blog/posts/${id}/increment_views/`);
    return response.data;
  },

  // Get comments for a blog post
  async getComments(blogPostId) {
    const response = await apiClient.get(`/blog/comments/?blog_post=${blogPostId}`);
    return response.data;
  },

  // Create comment
  async createComment(data) {
    const response = await apiClient.post('/blog/comments/', data);
    return response.data;
  },

  // Update comment
  async updateComment(id, data) {
    const response = await apiClient.patch(`/blog/comments/${id}/`, data);
    return response.data;
  },

  // Delete comment
  async deleteComment(id) {
    const response = await apiClient.delete(`/blog/comments/${id}/`);
    return response.data;
  },

  // Get my comments
  async getMyComments() {
    const response = await apiClient.get('/blog/comments/my_comments/');
    return response.data;
  },
};

export default blogService;
