import React from "react";

type LayoutContext = {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
};

const LayoutCtx = React.createContext({} as LayoutContext);

export const LayoutProvider: React.FC = ({ children }) => {
  const [searchKeyword, setSearchKW] = React.useState("");

  const handleSearchKeywordChange = React.useCallback((value: string) => {
    setSearchKW(value);
  }, []);

  return (
    <LayoutCtx.Provider
      value={{ searchKeyword, setSearchKeyword: handleSearchKeywordChange }}
    >
      {children}
    </LayoutCtx.Provider>
  );
};

export const useLayoutCtx = () => React.useContext(LayoutCtx);
