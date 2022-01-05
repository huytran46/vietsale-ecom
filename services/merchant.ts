import axios, { AxiosResponse } from "axios";
import _isArray from "lodash/isArray";
import { HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { BaseReponse } from "models/common/BaseResponse";
import { HttpQueryParam } from "models/common/SearchQuery";
import { MyFile } from "models/MyFile";
import { Product, ProductStatus } from "models/Product";
import { CreateProductPayload } from "models/request-response/Merchant";
import { ApproveOrderPayload, Order, OrderStatus } from "models/Order";
import { stringifyUrl } from "query-string";

export const FETCH_SHOP_PRODUCTS_MERCH = "/merchant/products";
type ProductsResponse = BaseReponse<{ products: Product[] }> | undefined;
export async function fetchShopProductsForMerch(
  token: string,
  shopId: string,
  status?: ProductStatus,
  params?: HttpQueryParam
): Promise<ProductsResponse> {
  try {
    const res = await axios.get<ProductsResponse>(
      stringifyUrl(
        {
          url: HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/product`,
          query: {
            ...params,
            _appr: `${Boolean(status === ProductStatus.APPROVED)}`,
            _blocked: `${Boolean(status === ProductStatus.BLOCKED)}`,
          },
        },
        { skipEmptyString: true, skipNull: true }
      ),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return {} as ProductsResponse;
  }
}

export const CREATE_SHOP_PRODUCT_MERCH = "/merchant/products";
type CreateProductResponse = BaseReponse<{ product: Product }>;
export async function doCreateShopProduct(
  token: string,
  shopId: string,
  payload: CreateProductPayload
): Promise<CreateProductResponse> {
  try {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (_isArray(val)) {
        val.forEach((singleVal) => params.append(key, singleVal));
        return;
      }
      params.append(key, val);
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const res = await axios.post<
      URLSearchParams,
      AxiosResponse<CreateProductResponse>
    >(
      HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/product`,
      params,
      config
    );
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as CreateProductResponse;
  }
}

export const UPDATE_SHOP_PRODUCT_MERCH = "/merchant/products";
type UpdateProductResponse = BaseReponse<{ product: Product }>;
export async function doEditShopProduct(
  token: string,
  shopId: string,
  pid: string,
  payload: CreateProductPayload
): Promise<UpdateProductResponse> {
  try {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (_isArray(val)) {
        val.forEach((singleVal) => params.append(key, singleVal));
        return;
      }
      params.append(key, val);
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const res = await axios.put<
      URLSearchParams,
      AxiosResponse<UpdateProductResponse>
    >(
      HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/product/${pid}`,
      params,
      config
    );
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as CreateProductResponse;
  }
}

export const FETCH_SHOP_PRODUCT_DETAIL_MERCH = "/merchant/products/detail";
type ProductDetailResponse = BaseReponse<{ product: Product }> | undefined;
export async function fetchShopProductDetailForMerch(
  token: string,
  shopId: string,
  pid: string,
  params?: HttpQueryParam
): Promise<Product> {
  try {
    const res = await axios.get<ProductDetailResponse>(
      HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/product/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data?.data?.product ?? ({} as Product);
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as Product;
  }
}

export const FETCH_SHOP_FILES_MERCH = "/merchant/files";
type FilesResponse = BaseReponse<{ upload_files: MyFile[] }> | undefined;
export async function fetchShopFilesForMerch(
  token: string,
  shopId: string
): Promise<FilesResponse> {
  try {
    const res = await axios.get<FilesResponse>(
      HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/file`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as FilesResponse;
  }
}

export const UPLOAD_SHOP_FILE_MERCH = "/merchant/files";
export type UploadProgressCallback = ((progressEvent: any) => void) | undefined;
type UploadFileResponse = BaseReponse<{ upload_file: MyFile }>;
export async function doUploadFile(
  token: string,
  shopId: string,
  payload: FormData
): Promise<UploadFileResponse> {
  try {
    const res = await axios.post<FormData, AxiosResponse<UploadFileResponse>>(
      HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/file`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as UploadFileResponse;
  }
}

export const FETCH_SHOP_ORDERS_MERCH = "/merchant/orders";
type OrdersResponse = BaseReponse<{ orders: Order[] }> | undefined;
export async function fetchShopOrdersForMerch(
  token: string,
  shopId: string,
  status?: OrderStatus,
  params?: HttpQueryParam
): Promise<OrdersResponse> {
  try {
    const res = await axios.get<OrdersResponse>(
      stringifyUrl(
        {
          url: HOST_URL_FOR_EXTERNAL_CALL + `/merchant/shop/${shopId}/order`,
          query: { ...params, status },
        },
        { skipEmptyString: true, skipNull: true }
      ),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as OrdersResponse;
  }
}

export const APPROVE_ORDER_MERCHANT = "/merchant/order/approve";
type ApproveOrderResponse = BaseReponse<{
  order_number: number;
  print_link?: string;
}>;
export async function doApproveOrder(
  token: string,
  shopId: string,
  orderId: string,
  service: "viettel-post" | "vn-post-fast",
  payload: ApproveOrderPayload
): Promise<ApproveOrderResponse> {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post<
      ApproveOrderPayload,
      AxiosResponse<ApproveOrderResponse>
    >(
      HOST_URL_FOR_EXTERNAL_CALL +
        `/merchant/shop/${shopId}/order/${orderId}/process/${service}`,
      payload,
      config
    );
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {} as ApproveOrderResponse;
  }
}

export const DELETE_SHOP_PRODUCT_MERCH = "/merchant/product/delete";
export async function deleteShopProduct(
  token: string,
  shopId: string,
  productId: string
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    axios
      .delete(
        HOST_URL_FOR_EXTERNAL_CALL +
          `/merchant/shop/${shopId}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => resolve(true))
      .catch((error) => {
        if (error.response) {
          reject(error.response.data);
        }
      });
  });
}
