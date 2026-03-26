export type TravelMode = "WALKING" | "TRANSIT" | "DRIVING";

export interface TransitDetails {
  lineName: string;
  lineShortName: string;
  vehicleType: string;
  departureStop: string;
  arrivalStop: string;
  departureTime: string;
  arrivalTime: string;
  numStops: number;
  lineColor?: string;
}

export interface DirectionsStep {
  instruction: string;
  distance: string;
  duration: string;
  travelMode: string;
  transitDetails?: TransitDetails;
}

export interface DirectionsResponse {
  summary: string;
  duration: string;
  durationValue: number;
  distance: string;
  distanceValue: number;
  startAddress: string;
  endAddress: string;
  steps: DirectionsStep[];
  overviewPolyline: string;
}
