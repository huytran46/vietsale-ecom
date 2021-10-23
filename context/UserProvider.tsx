import React from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { User } from "models/User";
import { UserAddress } from "models/UserAddress";
import { doFetchDefaultAddress } from "services/user";
import { LocalStorageKey } from "constants/local-storage";
import { doLogout } from "services/auth";
import { useRouter } from "next/router";

type UserContext = {
  visitorId: string;
  platform: string;
  user?: User;
  setUser: (nextState: User) => void;
  username: string;
  userAddresses: UserAddress[];
  defaultAddress?: UserAddress;
  fullDetailAddress: string;
  fetchUserAddresses: () => void;
  logout: () => Promise<void>;
};

const UserCtx = React.createContext<UserContext>({} as UserContext);

// Initialize an agent at application startup.
const fpPromise =
  typeof window !== "undefined" ? FingerprintJS.load() : undefined;

export const UserProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [visitorId, setVisitorId] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [user, setUser] = React.useState<User>();
  const [userAddresses, setUserAddresses] = React.useState<UserAddress[]>([]);
  const username = React.useMemo(() => {
    if (!user || user.email === "") return "";
    const split = user?.email?.split("@");
    if (!split || split.length < 1) return "";
    return split[0];
  }, [user]);

  const defaultAddress = React.useMemo(() => {
    if (!userAddresses) return;
    return userAddresses?.find((ad) => ad.is_default === true);
  }, [userAddresses]);

  const fullDetailAddress = React.useMemo(() => {
    if (!defaultAddress) return "";
    const prov = defaultAddress.edges?.in_province?.name;
    const dist = defaultAddress.edges?.in_district?.name;
    const wrd = defaultAddress.edges?.in_ward?.name;
    const street = defaultAddress.address;
    const full = `${street}, ${wrd}, ${dist}, ${prov}`;
    return full;
  }, [defaultAddress]);

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

  // const getProvinces = React.useCallback(async () => {}, []);
  // const getDistricts = React.useCallback(async () => {}, []);
  // const getWards = React.useCallback(async () => {}, []);
  const fetchUserAddresses = React.useCallback(() => {
    if (!user) return;
    doFetchDefaultAddress()
      .then((userAddresses) => setUserAddresses(userAddresses))
      .catch((err) => console.error(err))
      .finally();
  }, [user]);

  const logout = React.useCallback(async () => {
    if (!user) return;
    try {
      setUser(undefined);
      localStorage.removeItem(LocalStorageKey.EMAIL);
      router.push("/login");
      await doLogout();
    } catch (err) {
      console.error(err);
    }
  }, [user, router]);

  React.useEffect(() => {
    if (defaultAddress) return;
    fetchUserAddresses();
  }, [defaultAddress, fetchUserAddresses]);

  React.useEffect(() => {
    const email = localStorage.getItem(LocalStorageKey.EMAIL);
    if (!email || email === "") return;
    setUser({ email });
  }, []);

  React.useEffect(() => {
    if (visitorId !== "") return;
    doGetVisitorId();
    doGetPlatform();
  }, [visitorId, doGetVisitorId, doGetPlatform]);

  return (
    <UserCtx.Provider
      value={{
        visitorId,
        user,
        setUser,
        platform,
        username,
        userAddresses,
        defaultAddress,
        fullDetailAddress,
        fetchUserAddresses,
        logout,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export const useUser = () => React.useContext(UserCtx);
