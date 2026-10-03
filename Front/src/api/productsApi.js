import apiClient from './axiosClient';

export const productsApi = {
  // Categories from backend API
  async getCategories() {
    try {
      const response = await apiClient.get('/api/categories');
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Failed to load categories from API:', err.message);
      return [];
    }
  },

  // Products from backend API
  async getProducts(params = {}) {
    try {
      const cleanParams = { ...params };

      // Ensure categoryId is a valid GUID if passed as a slug
      if (cleanParams.categoryId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanParams.categoryId)) {
        const cats = await this.getCategories();
        const found = cats.find((c) => c.slug === cleanParams.categoryId || c.id === cleanParams.categoryId);
        if (found) {
          cleanParams.categoryId = found.id;
        } else {
          delete cleanParams.categoryId;
        }
      }

      const response = await apiClient.get('/api/products', { params: cleanParams });
      if (response.data && Array.isArray(response.data.items)) {
        return response.data;
      }
      if (Array.isArray(response.data)) {
        return {
          items: response.data,
          totalItems: response.data.length,
          page: 1,
          pageSize: response.data.length,
          totalPages: 1,
        };
      }
      return { items: [], totalItems: 0, page: 1, pageSize: 20, totalPages: 1 };
    } catch (err) {
      console.error('Failed to load products from API:', err.message);
      return { items: [], totalItems: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
  },

  // Single product by slug or ID
  async getProductBySlug(slug) {
    try {
      const response = await apiClient.get(`/api/products/slug/${slug}`);
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      // Fallback: search in products list
      try {
        const allRes = await apiClient.get('/api/products');
        const items = allRes.data?.items || (Array.isArray(allRes.data) ? allRes.data : []);
        const found = items.find((p) => p.slug === slug || p.id === slug);
        if (found) return found;
      } catch (innerErr) {
        console.error('Could not find product:', innerErr.message);
      }
    }
    return null;
  },

  // Product reviews from backend API
  async getProductReviews(productId) {
    try {
      const response = await apiClient.get(`/api/products/${productId}/reviews`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Failed to load product reviews:', err.message);
      return [];
    }
  },

  // Post review to backend API
  async submitReview(productId, reviewData) {
    const response = await apiClient.post(`/api/products/${productId}/reviews`, reviewData);
    return response.data;
  },
};

export default productsApi;
