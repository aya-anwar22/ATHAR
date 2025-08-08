export interface Product {
  _id?: string;
  productName: string;
  productSlug: string;
  collectionId: {
    _id: string;
    collectionsSlug: string;
    collectionsName: string;
  };
  price: number;
  quantity: number;
  gender: 'male' | 'female' | 'unisex';
  productImages: string[];
  stockAlertThreshold: number;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
