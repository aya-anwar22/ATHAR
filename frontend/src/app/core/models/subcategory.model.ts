export interface SubCategory {
  _id: string;
  subcategoryName: string;
  subcategoryImage: string;
  subcategorySlug: string;
  categoryId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryListResponse {
  activesubcategory: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: SubCategory[];
  };
}
