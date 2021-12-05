import React, { useEffect } from "react";
import { useUser } from "./UserProvider";

type LayoutContext = {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isGlobalLoading: boolean;
  setGlobalLoadingState: (nextState: boolean) => void;
};

const LayoutCtx = React.createContext({} as LayoutContext);

type LayoutProviderProp = {
  token?: string;
};
export const LayoutProvider: React.FC<LayoutProviderProp> = ({
  token,
  children,
}) => {
  const { setToken } = useUser();
  const [searchKeyword, setSearchKW] = React.useState("");
  const [isGlobalLoading, setGlobalLoadingState] = React.useState(false);

  const handleSearchKeywordChange = React.useCallback((value: string) => {
    setSearchKW(value);
  }, []);

  useEffect(() => {
    if (!token) return;
    setToken(token);
  }, [token]);

  return (
    <LayoutCtx.Provider
      value={{
        searchKeyword,
        setSearchKeyword: handleSearchKeywordChange,
        isGlobalLoading,
        setGlobalLoadingState,
      }}
    >
      {children}
    </LayoutCtx.Provider>
  );
};

export const useLayoutCtx = () => React.useContext(LayoutCtx);
