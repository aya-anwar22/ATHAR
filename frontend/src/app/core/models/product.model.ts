export interface Product {
  _id: string;
  productName: string;
  productSlug: string;
  brandId: string;
  subcategoryId: string;
  price: number;
  quantity: number;
  gender: string;
  productImages: string[];
  stockAlertThreshold: number;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPaginationResponse {
  activeProduct: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: Product[];
  };
  deletedProduct: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataDeleted: Product[];
  };
}




export interface UserProduct {
  _id: string;
  productName: string;
    description?: string;

  productSlug: string;
  brandId: string;
  subcategoryId: string;
  price: number;
  quantity: number;
  gender: 'male' | 'female' | string;
  productImages: string[];
  stockAlertThreshold: number;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  originalPrice?: number;

  createdAt: string;
  updatedAt: string;
  category?: {
  _id: string;
  categoryName: string;
};

}

export interface ProductListResponse {
  activeProdut: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: UserProduct[];
  };
}

