export type FloorPlanObjectKind = "table" | "counter" | "outlet" | "restroom" | "entrance" | "stairs" | "service" | "feature";
export type TableAvailability = "available" | "occupied" | "closed";

export interface FloorPlanObject {
  id: string;
  kind: FloorPlanObjectKind;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  seats?: number;
  sockets?: number;
  bookable?: boolean;
  note?: string;
}

export interface FloorPlanFloor {
  id: string;
  label: string;
  description: string;
  objects: FloorPlanObject[];
}

export interface CafeFloorPlan {
  id: string;
  cafeId: string;
  name: string;
  dataLabel: string;
  floors: FloorPlanFloor[];
}

export type TableAvailabilityMap = Record<string, TableAvailability>;
