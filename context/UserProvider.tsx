import React from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

import { User } from "models/User";
import { UserAddress } from "models/UserAddress";
import { doFetchDefaultAddress } from "services/user";
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

const UserCtx = React.createContext<UserContext>({} as UserContext);

// Initialize an agent at application startup.
const fpPromise =
  typeof window !== "undefined" ? FingerprintJS.load() : undefined;

export const UserProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const toaster = useToast();

  const [visitorId, setVisitorId] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [user, setUser] = React.useState<User>();
  const [userAddresses, setUserAddresses] = React.useState<UserAddress[]>([]);

  const [provinces, setProvinces] = React.useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = React.useState<Province>();
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState<District>();
  const [wards, setWards] = React.useState<Ward[]>([]);
  const [selectedWard, setSelectedWard] = React.useState<Ward>();

  const username = React.useMemo(() => {
    if (!user || user.email === "") return "";
    const split = user?.email?.split("@");
    if (!split || split.length < 1) return "";
    return split[0];
  }, [user]);

  const defaultAddress = React.useMemo(() => {
    if (!userAddresses) return;
    if (!userAddresses.length) return;
    if (!Array.isArray(userAddresses)) return;
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

  const fetchUserAddresses = React.useCallback(() => {
    if (!user) return;
    doFetchDefaultAddress()
      .then((userAddresses) => {
        if (Array.isArray(userAddresses)) {
          setUserAddresses(userAddresses);
        }
      })
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

  const shopInfo = React.useMemo(() => {
    if (!user || !user.is_merchant) return;
    const merch: Shop = JSON.parse(
      localStorage.getItem(LocalStorageKey.MERCHANT) ?? ""
    );
    return merch;
  }, [user]);

  const shopId = React.useMemo(() => {
    if (!user || !user.is_merchant || !shopInfo) return;
    return shopInfo.id;
  }, [user, shopInfo]);

  const doFetchProvinces = React.useCallback(() => {
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

  const doFetchDistricts = React.useCallback(
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

  const doFetchWards = React.useCallback(
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

  React.useEffect(() => {
    if (defaultAddress) return;
    fetchUserAddresses();
  }, [defaultAddress, fetchUserAddresses]);

  React.useEffect(() => {
    const usrRaw = localStorage.getItem(LocalStorageKey.ME);
    if (!usrRaw || usrRaw === "") return;
    const user = JSON.parse(usrRaw);
    if (!user || user === "") return;
    setUser(user);
  }, []);

  React.useEffect(() => {
    if (visitorId !== "") return;
    doGetVisitorId();
    doGetPlatform();
  }, [visitorId, doGetVisitorId, doGetPlatform]);

  React.useEffect(() => {
    if (!selectedProvince) return;
    console.log("selectedProvince:", selectedProvince.name);
    doFetchDistricts(selectedProvince.id);
  }, [selectedProvince]);

  React.useEffect(() => {
    if (!selectedDistrict) return;
    doFetchWards(selectedDistrict.id);
  }, [selectedDistrict]);

  return (
    <UserCtx.Provider
      value={{
        visitorId,
        user,
        setUser,
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

export const useUser = () => React.useContext(UserCtx);
