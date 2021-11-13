export type UomValue = {
  id: number;
  measure_value: string;
  created_at: string;
  updated_at: string;
};

export type Uom = {
  id: number;
  measure_name: string;
  created_at: string;
  updated_at: string;
  edges: UomValue[];
};
