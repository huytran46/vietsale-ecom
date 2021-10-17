import React from "react";

type LayoutContext = {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isGlobalLoading: boolean;
  setGlobalLoadingState: (nextState: boolean) => void;
};

const LayoutCtx = React.createContext({} as LayoutContext);

export const LayoutProvider: React.FC = ({ children }) => {
  const [searchKeyword, setSearchKW] = React.useState("");
  const [isGlobalLoading, setGlobalLoadingState] = React.useState(false);

  const handleSearchKeywordChange = React.useCallback((value: string) => {
    setSearchKW(value);
  }, []);

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
