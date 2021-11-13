import { HOST_URL } from "constants/platform";
import { HttpQueryParam } from "models/common/SearchQuery";
import { stringifyUrl } from "query-string";

export const parseUrlWithQueries = (baseUrl: string, param?: HttpQueryParam) =>
  stringifyUrl(
    { url: HOST_URL + baseUrl, query: param },
    { skipEmptyString: true, skipNull: true, arrayFormat: "index" }
  );
