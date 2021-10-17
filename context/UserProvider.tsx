import React from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { User } from "models/User";
import { UserAddress } from "models/UserAddress";

type UserContext = {
  visitorId: string;
  platform: string;
  user?: User;
  setUser: (nextState: User) => void;
};

const UserCtx = React.createContext<UserContext>({} as UserContext);

// Initialize an agent at application startup.
const fpPromise =
  typeof window !== "undefined" ? FingerprintJS.load() : undefined;

export const UserProvider: React.FC = ({ children }) => {
  const [visitorId, setVisitorId] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [user, setUser] = React.useState<User>();
  const [userAddress, setUserAddress] = React.useState<UserAddress>();

  const fingerPrintResult = React.useMemo(async () => {
    if (typeof window === "undefined" || !fpPromise) return undefined;
    const fp = await fpPromise;
    return await fp.get();
  }, []);

  const promiseOfVisitorId = React.useMemo(async () => {
    const result = await fingerPrintResult;
    if (!result) return "";
    return result.visitorId;
  }, [fingerPrintResult]);

  const promiseOfPlatform = React.useMemo(async () => {
    const result = await fingerPrintResult;
    if (!result) return "";
    return result.components.platform.value;
  }, [fingerPrintResult]);

  const doGetVisitorId = React.useCallback(async () => {
    const vId = await promiseOfVisitorId;
    if (vId === "") return;
    setVisitorId(vId);
  }, [promiseOfVisitorId]);

  const doGetPlatform = React.useCallback(async () => {
    const pl = await promiseOfPlatform;
    if (!pl) return;
    setPlatform(pl);
  }, [promiseOfPlatform]);

  const getProvinces = React.useCallback(async () => {}, []);
  const getDistricts = React.useCallback(async () => {}, []);
  const getWards = React.useCallback(async () => {}, []);

  React.useEffect(() => {
    if (visitorId !== "") return;
    doGetVisitorId();
    doGetPlatform();
  }, [visitorId, doGetVisitorId, doGetPlatform]);

  return (
    <UserCtx.Provider value={{ visitorId, user, setUser, platform }}>
      {children}
    </UserCtx.Provider>
  );
};

export const useUser = () => React.useContext(UserCtx);
