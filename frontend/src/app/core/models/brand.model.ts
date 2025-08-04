export interface Brand {
  _id: string;
  brandName: string;
  brandSlug: string;
  brandImage: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandPaginationResponse {
  activeBrands: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: Brand[];
  };
  deletedBrands: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataDeleted: Brand[];
  };
}
