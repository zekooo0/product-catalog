export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Category {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Product {
  _id?: string;
  imageURL: string;
  domainName: string;
  url: string;
  description: string;
  rating: number;
  freeTrialAvailable: boolean;
  reviewers: Array<{
    name: string;
    url: string;
  }>;
  keywords: string[];
  categories: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minRating?: number;
  freeTrialAvailable?: boolean;
  sort?: string;
}
