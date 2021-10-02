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
