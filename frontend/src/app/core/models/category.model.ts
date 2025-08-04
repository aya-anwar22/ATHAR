export interface Categry {
  _id: string;
  categoryName: string;
  categorySlug: string;
  categoryImage: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
    productCount?: number;

  createdAt: string;
  updatedAt: string;
}

export interface CategryPaginationResponse {
  activeCategory: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: Categry[];
  };
  deletedCategory: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataDeleted: Categry[];
  };
}
