import React from "react";

type LayoutContext = {
  searchKeyword: string;
};

const LayoutCtx = React.createContext({} as LayoutContext);

export const LayoutProvider: React.FC = ({ children }) => {
  const [searchKeyword, setSearchKW] = React.useState("");
  return (
    <LayoutCtx.Provider value={{ searchKeyword }}>
      {children}
    </LayoutCtx.Provider>
  );
};

export const useLayoutCtx = () => React.useContext(LayoutCtx);
