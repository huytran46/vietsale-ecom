import { MyFileType } from './MyFile';

export interface ProductCategory {
  id: string;
  priority?: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  edges?: {
    icon?: {
      id: string;
      file_name: string;
      file_size: number;
      file_mime: string;
      file_path: string;
      file_thumbnail: string;
      file_type: MyFileType;
      created_at: string;
      updated_at: string;
    };
    children?: ProductCategory[];
    parent?: ProductCategory;
  };
}
