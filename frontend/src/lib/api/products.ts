import { API_BASE_URL } from "../config";
import { Product, ProductFilters } from "../types";

export const productsApi = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/products?${queryParams.toString()}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch products");
    }

    return response.json();
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch product");
    }

    return response.json();
  },

  async createProduct(
    token: string,
    product: Omit<Product, "_id" | "createdAt" | "updatedAt"> | FormData
  ): Promise<Product> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type for JSON data, let browser set it for FormData
    if (!(product instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers,
      body: product instanceof FormData ? product : JSON.stringify(product),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  },

  async updateProduct(
    token: string,
    id: string,
    product: Partial<Omit<Product, "_id" | "createdAt" | "updatedAt">> | FormData
  ): Promise<Product> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type for JSON data, let browser set it for FormData
    if (!(product instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers,
      body: product instanceof FormData ? product : JSON.stringify(product),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  },

  async deleteProduct(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }
  },
};
