export interface BaseReponse<T> {
  success: boolean;
  message: string;
  data: T;
  page_size: number;
  page_no: number;
  total_page: number;
  total_items: number;
}
