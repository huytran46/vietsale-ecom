interface Location {
  id: number;
  name: string;
  viettel_ref_id: number;
  viettel_ref_name: string;
  vnpost_ref_id: string;
  vnpost_ref_name: string;
  created_at: string;
  updated_at: string;
}

export interface Ward extends Location {
  ward_id: string;
  edges: WardEdge;
}

export type WardEdge = {
  in: District;
};

export interface District extends Location {
  district_id: string;
  edges: DistrictEdge;
}
export type DistrictEdge = {
  in: Province;
};

export interface Province extends Location {
  province_id: string;
}
