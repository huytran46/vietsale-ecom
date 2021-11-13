export interface CreateProductPayload {
  productName: string;
  cover: string;
  sku: string;
  unitValueID: number;
  price: number;
  shortDesc?: string;
  desc: string;
  isPercentDiscount: boolean;
  discountValue?: number;
  fileIDs?: string[];
  cateIDs: string[];
  attrValueIDs?: string[];
  quantity: number;
  weight: number;
  height: number;
  width: number;
  length: number;
}

export interface UploadFilePayload {
  uploadFile: FormData;
}
