export interface Road {
  id: string;
  roadName: string;
  city: string;
  roadType: string;
  lanes: number;
  speedKph: number;
  trafficIndex: number;
  direction: string;
  wkt: string;
}

export interface AnalysisRequest {
  city?: string;
  roadType?: string;
}

export interface AnalysisResponse {
  roads: Road[];
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

