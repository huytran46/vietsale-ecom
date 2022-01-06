import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  createContext,
} from "react";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useQuery } from "react-query";

import { User } from "models/User";
import { UserAddress } from "models/UserAddress";
import {
  doFetchDefaultAddress,
  FETCH_DEFAULT_ADDRESS_URI,
} from "services/user";
import { LocalStorageKey } from "constants/local-storage";
import { doLogout } from "services/auth";
import { Shop } from "models/Shop";
import { fetchDistricts, fetchProvinces, fetchWards } from "services/public";
import { District, Province, Ward } from "models/Location";

type UserContext = {
  visitorId: string;
  platform: string;

  user?: User;
  setUser: (nextState: User) => void;
  username: string;
  token?: string;
  setToken: (b: string) => void;

  userAddresses: UserAddress[];
  defaultAddress?: UserAddress;
  fullDetailAddress: string;
  fetchUserAddresses: () => void;

  logout: () => Promise<void>;

  shopId?: string;
  shopInfo?: Shop;

  provinces: Province[];
  districts: District[];
  wards: Ward[];

  selectedProvince?: Province;
  selectedDistrict?: District;
  selectedWard?: Ward;

  setSelectedProvince: (next: Province) => void;
  setSelectedDistrict: (next: District) => void;
  setSelectedWard: (next: Ward) => void;

  doFetchProvinces: () => void;
  doFetchDistricts: (parentId: number) => void;
  doFetchWards: (parentId: number) => void;
};

const UserCtx = createContext<UserContext>({} as UserContext);

// Initialize an agent at application startup.
const fpPromise =
  typeof window !== "undefined" ? FingerprintJS.load() : undefined;

export const UserProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const toaster = useToast({
    duration: 3000,
    position: "bottom",
  });

  const [visitorId, setVisitorId] = useState("");
  const [platform, setPlatform] = useState("");
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  // const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District>();
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWard, setSelectedWard] = useState<Ward>();

  const { data: userAddresses, refetch: fetchUserAddresses } = useQuery<
    UserAddress[]
  >(
    [FETCH_DEFAULT_ADDRESS_URI, token],
    ({ queryKey }) => doFetchDefaultAddress(queryKey[1] as string),
    {
      enabled: typeof token !== "undefined" && token !== "",
    }
  );

  const username = useMemo(() => {
    if (!user || user.email === "") return "";
    const split = user?.email?.split("@");
    if (!split || split.length < 1) return "";
    return split[0];
  }, [user]);

  const defaultAddress = useMemo(() => {
    if (!userAddresses) return;
    if (!userAddresses.length) return;
    if (!Array.isArray(userAddresses)) return;
    return userAddresses?.find((ad) => ad.is_default === true);
  }, [userAddresses]);

  const fullDetailAddress = useMemo(() => {
    if (!defaultAddress) return "";
    const prov = defaultAddress.edges?.in_province?.name;
    const dist = defaultAddress.edges?.in_district?.name;
    const wrd = defaultAddress.edges?.in_ward?.name;
    const street = defaultAddress.address;
    const full = `${street}, ${wrd}, ${dist}, ${prov}`;
    return full;
  }, [defaultAddress]);

  const fingerPrintResult = useMemo(async () => {
    if (typeof window === "undefined" || !fpPromise) return undefined;
    const fp = await fpPromise;
    return await fp.get();
  }, []);

  const promiseOfVisitorId = useMemo(async () => {
    const result = await fingerPrintResult;
    if (!result) return "";
    return result.visitorId;
  }, [fingerPrintResult]);

  const promiseOfPlatform = useMemo(async () => {
    const result = await fingerPrintResult;
    if (!result) return "";
    return result.components.platform.value;
  }, [fingerPrintResult]);

  const doGetVisitorId = useCallback(async () => {
    const vId = await promiseOfVisitorId;
    if (vId === "") return;
    setVisitorId(vId);
  }, [promiseOfVisitorId]);

  const doGetPlatform = useCallback(async () => {
    const pl = await promiseOfPlatform;
    if (!pl) return;
    setPlatform(pl);
  }, [promiseOfPlatform]);

  // const fetchUserAddresses = useCallback(() => {
  //   if (!user || !token) return;
  //   doFetchDefaultAddress(token)
  //     .then((userAddresses) => {
  //       if (Array.isArray(userAddresses)) {
  //         setUserAddresses(userAddresses);
  //       }
  //     })
  //     .catch((err) => console.error(err))
  //     .finally();
  // }, [user, token]);

  const logout = useCallback(async () => {
    if (!user) return;
    try {
      setUser(undefined);
      await doLogout();
      localStorage.removeItem(LocalStorageKey.EMAIL);
      localStorage.removeItem(LocalStorageKey.ME);
      localStorage.removeItem(LocalStorageKey.MERCHANT);
      await router.push("/login");
    } catch (err) {
      console.error(err);
    }
  }, [user, router]);

  const shopInfo = useMemo(() => {
    if (!user || !user.is_merchant) return;
    const merch: Shop = JSON.parse(
      localStorage.getItem(LocalStorageKey.MERCHANT) ?? ""
    );
    return merch;
  }, [user]);

  const shopId = useMemo(() => {
    if (!user || !user.is_merchant || !shopInfo) return;
    return shopInfo.id;
  }, [user, shopInfo]);

  const doFetchProvinces = useCallback(() => {
    fetchProvinces()
      .then((res) => setProvinces(res))
      .catch((err) =>
        toaster({
          description: err,
          title: "Lỗi",
          status: "error",
        })
      );
  }, [toaster]);

  const doFetchDistricts = useCallback(
    (provinceId: number) => {
      fetchDistricts({ province_id: provinceId })
        .then((res) => setDistricts(res))
        .catch((err) =>
          toaster({
            description: err,
            title: "Lỗi",
            status: "error",
          })
        );
    },
    [toaster]
  );

  const doFetchWards = useCallback(
    (districtId: number) => {
      fetchWards({ district_id: districtId })
        .then((res) => setWards(res))
        .catch((err) =>
          toaster({
            description: err,
            title: "Lỗi",
            status: "error",
          })
        );
    },
    [toaster]
  );

  useEffect(() => {
    if (defaultAddress) return;
    fetchUserAddresses();
  }, [defaultAddress, fetchUserAddresses]);

  useEffect(() => {
    const usrRaw = localStorage.getItem(LocalStorageKey.ME);
    if (!usrRaw || usrRaw === "") return;
    const user = JSON.parse(usrRaw);
    if (!user || user === "") return;
    setUser(user);
  }, []);

  useEffect(() => {
    if (visitorId !== "") return;
    doGetVisitorId();
    doGetPlatform();
  }, [visitorId, doGetVisitorId, doGetPlatform]);

  useEffect(() => {
    if (!selectedProvince) return;
    doFetchDistricts(selectedProvince.id);
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) return;
    doFetchWards(selectedDistrict.id);
  }, [selectedDistrict]);

  return (
    <UserCtx.Provider
      value={{
        visitorId,
        user,
        setUser,
        token,
        setToken,
        platform,
        username,
        userAddresses: userAddresses ?? [],
        defaultAddress,
        fullDetailAddress,
        fetchUserAddresses,
        logout,
        shopId,
        shopInfo,

        provinces,
        districts,
        wards,

        selectedProvince,
        selectedDistrict,
        selectedWard,

        setSelectedProvince,
        setSelectedDistrict,
        setSelectedWard,

        doFetchProvinces,
        doFetchDistricts,
        doFetchWards,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export const useUser = () => useContext(UserCtx);
