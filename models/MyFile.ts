export type MyFileType = 'image' | 'video';

export interface MyFile {
  id: string;
  file_name: string;
  file_size: number;
  file_mime: string;
  file_path: string;
  file_thumbnail: string;
  file_type: MyFileType;
  created_at: string;
  updated_at: string;
  edges?: Record<string, unknown>;
}

export const MyFileNameMap: Record<MyFileType, string> = {
  image: 'Hình ảnh',
  video: 'Video',
};
