import { HOST_URL } from "constants/platform";
import { HttpQueryParam } from "models/common/SearchQuery";
import { stringifyUrl } from "query-string";
import { dehydrate, QueryClient } from "react-query";

type OtherOptions = {
  noLayout?: boolean;
  props?: Record<string, any>;
};

export async function withQuery(
  queryKey: string,
  fetcher: () => Promise<unknown>,
  options?: OtherOptions
) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(queryKey, fetcher);
  return {
    props: {
      ...options?.props,
      noLayout: Boolean(options?.noLayout),
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export const urlWithQuery = (baseUrl: string, param?: HttpQueryParam) =>
  stringifyUrl(
    { url: HOST_URL + baseUrl, query: param },
    { skipEmptyString: true, skipNull: true }
  );
