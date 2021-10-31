import { PaginationParams } from "./PaginationParams";

export interface SearchQuery {
  _q?: string;
  _from?: string;
  _to?: string;
  sort?: string;
  cateIDs?: string[];
}

export type HttpQueryParam = PaginationParams & Partial<SearchQuery>;
