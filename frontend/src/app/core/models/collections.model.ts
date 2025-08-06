export interface Collection {
  _id?: string;
  collectionName: string;
  collectionSlug: string;
  collectionImage: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CollectionPaginationResponse {
  activeCollections: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataActive: Collection[];
  };
  deletedCollections: {
    total: number;
    currentPage: number;
    totalPages: number;
    dataDeleted: Collection[];
  };
}
