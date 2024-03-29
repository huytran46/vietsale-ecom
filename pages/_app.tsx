import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

import { theme } from "../theme";
import Layout from "components/Layout";
import MerchantLayout from "components/MerchantLayout";

import "styles/style.css"; // fonts

// 3rd parties styles
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";

// React Quill HTML Editor
import "react-quill/dist/quill.snow.css";
// react-datepicker
import "react-datepicker/dist/react-datepicker.css";

// Custom context
import { LayoutProvider } from "context/LayoutProvider";
import { UserProvider } from "context/UserProvider";
import { CartProvider } from "context/CartProvider";
import { OrderProvider } from "context/OrderProvider";
import { LayoutType } from "constants/common";
import { FileProvider } from "context/FileProvider";
import { FORCED_CLEAR_KEYS } from "constants/platform";
import { lsTimeToLive } from "utils/local-storage";
import { LocalStorageKey } from "constants/local-storage";
import { isArray } from "lodash";

function layoutLoader(
  layout: LayoutType,
  Component: NextComponentType<NextPageContext, any, {}>,
  pageProps: any
) {
  switch (layout) {
    case LayoutType.NONE:
      return <Component {...pageProps} />;
    case LayoutType.MERCH:
      return (
        <MerchantLayout>
          <Component {...pageProps} />
        </MerchantLayout>
      );
    default:
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const forcedClearValues = window.localStorage.getItem(
      LocalStorageKey.FORCE_CLEAR
    );

    let shouldBeAddedValues: string[] = [];
    const empty = {
      value: [],
      expiration: 0,
    };

    const jsonForcedKeys = forcedClearValues
      ? JSON.parse(forcedClearValues)
      : empty;

    FORCED_CLEAR_KEYS.forEach((key) => {
      const shouldBeAdded = !jsonForcedKeys?.value?.includes(key + "--");
      if (shouldBeAdded) {
        shouldBeAddedValues.push(key, `${key}--`);
      } else {
        shouldBeAddedValues.push(`${key}--`);
      }
    });
    lsTimeToLive.set(LocalStorageKey.FORCE_CLEAR, shouldBeAddedValues);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <UserProvider>
            <CartProvider>
              <OrderProvider>
                <FileProvider>
                  <LayoutProvider token={pageProps.token}>
                    {layoutLoader(
                      pageProps.layout as LayoutType,
                      Component,
                      pageProps
                    )}
                  </LayoutProvider>
                </FileProvider>
              </OrderProvider>
            </CartProvider>
          </UserProvider>
        </ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
