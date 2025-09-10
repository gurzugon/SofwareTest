import React, { useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AnalysisResponse, Road } from '../types';
import { parseWktLineString, Coordinate } from '../utils/wktParser';

interface RoadMapProps {
  allRoads: Road[];
  results: AnalysisResponse | null;
  isLoading: boolean;
  showAllRoads: boolean;
}

function getTrafficColor(trafficIndex: number): string {
  if (trafficIndex >= 0.8) return '#ff0000';
  if (trafficIndex >= 0.6) return '#ff6600';
  if (trafficIndex >= 0.4) return '#ffcc00';
  return '#00cc00';
}

// Component to handle map updates
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

const RoadMap: React.FC<RoadMapProps> = ({ allRoads, results, isLoading, showAllRoads }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.1319, 101.6841]);
  const [mapZoom, setMapZoom] = useState<number>(9);

  // Handle road click to zoom to coordinates
  const handleRoadClick = (road: Road) => {
    const coordinates = parseWktLineString(road.wkt);
    if (coordinates.length > 0) {
      const center = coordinates[0];
      setMapCenter([center.lat, center.lng]);
      setMapZoom(15); // Zoom in closer when clicking on a specific road
    }
  };

  const roadData = useMemo(() => {
    if (showAllRoads && allRoads.length > 0) {
      // Show all roads with basic styling
      return allRoads.map((road) => {
        const coordinates = parseWktLineString(road.wkt);
        const center = coordinates.length > 0 ? coordinates[0] : null;
        return { road, center, coordinates };
      }).filter(road => road.center !== null);
    } else if (results && results.roads.length > 0) {
      // Show analyzed results with enhanced styling
      return results.roads.map((road) => {
        const coordinates = parseWktLineString(road.wkt);
        const center = coordinates.length > 0 ? coordinates[0] : null;
        return { road, center, coordinates };
      }).filter(road => road.center !== null);
    }
    return [];
  }, [allRoads, results, showAllRoads]);

  // Update map center when roadData changes (for initial load)
  React.useEffect(() => {
    if (roadData.length > 0 && showAllRoads) {
      const firstCenter = roadData[0]?.center;
      if (firstCenter) {
        setMapCenter([firstCenter.lat, firstCenter.lng]);
        setMapZoom(9);
      }
    }
  }, [roadData, showAllRoads]);

  return (
    <div className="map-container">
      <div className="map-header">
        <h3>{showAllRoads ? 'Road Analysis Best Burger Teramat Viral' : 'Road Analysis Best Burger Teramat Viral'}</h3>
        <div className="map-info">
          {isLoading ? 'Loading road data...' : `Showing ${roadData.length} road${roadData.length !== 1 ? 's' : ''}`}
        </div>
      </div>
      
      {/* Floating Legend */}
      <div className="floating-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff0000' }}></div>
          <span>Very High Traffic (0.8+)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff6600' }}></div>
          <span>High Traffic (0.6-0.8)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffcc00' }}></div>
          <span>Medium Traffic (0.4-0.6)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00cc00' }}></div>
          <span>Low Traffic (0.0-0.4)</span>
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '400px', width: '100%' }}>
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
        {roadData.map((road, idx) => (
          <React.Fragment key={road.road.id}>
            <Polyline
              positions={road.coordinates.map((c: Coordinate) => [c.lat, c.lng])}
              pathOptions={{ 
                color: getTrafficColor(road.road.trafficIndex), 
                weight: showAllRoads ? 3 : 8,
                opacity: showAllRoads ? 0.7 : 1.0
              }}
            >
              <Popup>
                <div className="popup-content">
                  <strong>{road.road.roadName}</strong><br />
                  City: {road.road.city}<br />
                  Type: {road.road.roadType}<br />
                  Lanes: {road.road.lanes}<br />
                  Speed: {road.road.speedKph} km/h<br />
                  Traffic: {road.road.trafficIndex.toFixed(2)}
                </div>
              </Popup>
            </Polyline>
          </React.Fragment>
        ))}
      </MapContainer>
      <div className="road-coordinates">
        {roadData.map((road) => (
          <div 
            key={road.road.id} 
            className="road-item" 
            onClick={() => handleRoadClick(road.road)}
            style={{ 
              borderLeft: '4px solid',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="road-header">
              <h4>{road.road.roadName}</h4>
              <span
                className="traffic-color"
                style={{ backgroundColor: getTrafficColor(road.road.trafficIndex) }}
              >
                Traffic: {road.road.trafficIndex.toFixed(2)}
              </span>
            </div>
            <div className="road-details">
              <p><strong>City:</strong> {road.road.city}</p>
              <p><strong>Type:</strong> {road.road.roadType}</p>
              <p><strong>Lanes:</strong> {road.road.lanes}</p>
              <p><strong>Speed:</strong> {road.road.speedKph} km/h</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadMap;
