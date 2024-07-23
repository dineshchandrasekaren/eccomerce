export interface IBigQ {
  search?: string;
  limit?: number;
  page?: number;
  price?: {
    lte?: number;
    gte?: number;
    lt?: number;
    gt?: number;
  };
  category?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}
