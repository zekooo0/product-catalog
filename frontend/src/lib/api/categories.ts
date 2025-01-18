import { API_BASE_URL } from '../config';
import { Category } from '../types';

export const categoriesApi = {
    async getCategories(): Promise<Category[]> {
        const response = await fetch(`${API_BASE_URL}/categories`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch categories');
        }

        return response.json();
    },

    async createCategory(token: string, category: Omit<Category, '_id'>): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(category),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create category');
        }

        return response.json();
    },

    async updateCategory(
        token: string,
        id: string,
        category: Partial<Omit<Category, '_id'>>
    ): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(category),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update category');
        }

        return response.json();
    },

    async deleteCategory(token: string, id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete category');
        }
    },
};
