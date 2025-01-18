export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
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
    category: string[];
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
