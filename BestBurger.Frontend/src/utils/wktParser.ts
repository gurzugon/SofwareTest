// WKT (Well-Known Text) Parser for LineString coordinates
export interface Coordinate {
  lng: number;
  lat: number;
}

export function parseWktLineString(wkt: string): Coordinate[] {
  try {
    // Extract coordinates from WKT LineString format
    // Example: "LINESTRING (101.51862624325574 3.07086655926708, 101.51937653643942 3.071098666648568)"
    const coordMatch = wkt.match(/LINESTRING\s*\(([^)]+)\)/i);
    
    if (!coordMatch) {
      console.warn('Invalid WKT LineString format:', wkt);
      return [];
    }
    
    const coordString = coordMatch[1];
    const coordPairs = coordString.split(',').map(pair => pair.trim());
    
    return coordPairs.map(pair => {
      const [lng, lat] = pair.split(/\s+/).map(Number);
      return { lng, lat };
    }).filter(coord => !isNaN(coord.lng) && !isNaN(coord.lat));
    
  } catch (error) {
    console.error('Error parsing WKT:', error);
    return [];
  }
}

export function getLineStringCenter(coordinates: Coordinate[]): Coordinate {
  if (coordinates.length === 0) {
    return { lng: 101.6869, lat: 3.1390 }; // Default to Selangor center
  }
  
  const sum = coordinates.reduce(
    (acc, coord) => ({
      lng: acc.lng + coord.lng,
      lat: acc.lat + coord.lat
    }),
    { lng: 0, lat: 0 }
  );
  
  return {
    lng: sum.lng / coordinates.length,
    lat: sum.lat / coordinates.length
  };
}
