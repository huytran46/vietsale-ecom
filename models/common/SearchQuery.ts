import { PaginationParams } from "./PaginationParams";

export interface ProductSearchQuery {
  sort?: string;
  cateIDs?: string[];
}

export interface SearchQuery extends ProductSearchQuery {
  _q?: string;
  _from?: string;
  _to?: string;
}

export type HttpQueryParam = PaginationParams &
  Partial<SearchQuery> &
  Partial<ProductSearchQuery>;
