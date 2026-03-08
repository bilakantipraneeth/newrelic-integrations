import axios from 'axios';

// Reads from environment variable at build time.
// In local dev: set in .env.local (REACT_APP_INGESTION_URL=http://localhost:8086)
// In GKE:       REACT_APP_INGESTION_URL points to the api-gateway LoadBalancer or ingestion-service
const API_BASE = process.env.REACT_APP_INGESTION_URL || 'http://localhost:8086';

const INGESTION_URL = `${API_BASE}/api/v1`;

export const getCategories = () => axios.get(`${INGESTION_URL}/categories`);
export const createCategory = (category) => axios.post(`${INGESTION_URL}/categories`, category);
export const deleteCategory = (id) => axios.delete(`${INGESTION_URL}/categories/${id}`);

export const getAllProducts = () => axios.get(`${INGESTION_URL}/products`);
export const getProductsByCategory = (catId) => axios.get(`${INGESTION_URL}/products/${catId}`);
export const createProduct = (catId, product) => axios.post(`${INGESTION_URL}/products/${catId}`, product);
export const deleteProduct = (catId, id) => axios.delete(`${INGESTION_URL}/products/${catId}/${id}`);
