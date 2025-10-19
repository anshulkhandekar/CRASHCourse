import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AggieFlowMap = () => {
  // State variables
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('8:00-8:50');
  const [buildingData, setBuildingData] = useState([]);
  const [clusterHotspots, setClusterHotspots] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [filteredHotspots, setFilteredHotspots] = useState([]);

  // Days and time slots for dropdowns
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '8:00-8:50',
    '9:10-10:00',
    '10:20-11:10',
    '11:30-12:20',
    '12:40-13:30',
    '13:50-14:40',
    '15:00-15:50',
    '16:10-17:00',
    '17:20-18:10'
  ];

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load building data
        const buildingResponse = await fetch('/Aggie_Flow_Dataset.json');
        const buildingJson = await buildingResponse.json();
        setBuildingData(buildingJson);

        // Load cluster hotspots
        const hotspotsResponse = await fetch('/AggieFlow_Cluster_Hotspots.json');
        const hotspotsJson = await hotspotsResponse.json();
        setClusterHotspots(hotspotsJson);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Filter data based on selected day and time
  useEffect(() => {
    // Filter building data
    const filtered = buildingData.filter(
      (building) =>
        building.Day === selectedDay && building['Time Slot'] === selectedTime
    );
    setFilteredBuildings(filtered);

    // Filter cluster hotspots
    const filteredHS = clusterHotspots.filter(
      (hotspot) =>
        hotspot.Day === selectedDay && hotspot['Time Slot'] === selectedTime
    );
    setFilteredHotspots(filteredHS);
  }, [selectedDay, selectedTime, buildingData, clusterHotspots]);

  return (
    <div className="aggie-flow-container">
      <style jsx>{`
        .aggie-flow-container {
          width: 100%;
          height: 100vh;
          position: relative;
        }

        .controls {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-group label {
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }

        .control-group select {
          padding: 8px 12px;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .control-group select:hover {
          border-color: #500000;
        }

        .control-group select:focus {
          outline: none;
          border-color: #500000;
        }

        .map-container {
          width: 100%;
          height: 100%;
        }

        .info-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          z-index: 1000;
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 250px;
        }

        .info-panel h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #500000;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .legend-color.green {
          background-color: #28a745;
        }

        .legend-color.red {
          background-color: #dc3545;
          animation: pulse 2s infinite;
        }

        .legend-text {
          font-size: 13px;
          color: #333;
        }

        /* Pulsating animation for hotspots - NO TRANSFORM to avoid Leaflet positioning conflicts */
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            filter: drop-shadow(0 0 0 rgba(220, 53, 69, 0));
          }
          50% {
            opacity: 0.7;
            filter: drop-shadow(0 0 15px rgba(220, 53, 69, 0.8));
          }
        }

        /* Target path elements that have the pulsating-hotspot class directly */
        /* Uses opacity and filter instead of transform to avoid position shifting */
        :global(path.pulsating-hotspot) {
          animation: pulse 2s infinite ease-in-out;
        }

        /* Leaflet popup customization */
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 8px;
        }

        :global(.leaflet-popup-content) {
          margin: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .popup-content {
          min-width: 150px;
        }

        .popup-content h4 {
          margin: 0 0 8px 0;
          color: #500000;
          font-size: 16px;
        }

        .popup-content p {
          margin: 4px 0;
          font-size: 14px;
          color: #333;
        }

        .popup-content strong {
          color: #000;
        }
      `}</style>

      {/* Control Panel */}
      <div className="controls">
        <div className="control-group">
          <label htmlFor="day-select">Select Day:</label>
          <select
            id="day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="time-select">Select Time:</label>
          <select
            id="time-select"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info/Legend Panel */}
      <div className="info-panel">
        <h3>Legend</h3>
        <div className="legend-item">
          <div className="legend-color green"></div>
          <span className="legend-text">Individual Buildings</span>
        </div>
        <div className="legend-item">
          <div className="legend-color red"></div>
          <span className="legend-text">Cluster Hotspots</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer
          center={[30.6134, -96.3402]}
          zoom={16}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Layer 1: Individual Buildings (Small Green Markers) */}
          {filteredBuildings.map((building, index) => (
            <CircleMarker
              key={`building-${index}`}
              center={[building.Latitude, building.Longitude]}
              radius={5}
              pathOptions={{
                fillColor: '#28a745',
                fillOpacity: 0.6,
                color: '#1e7e34',
                weight: 1,
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h4>{building['Building Name']}</h4>
                  <p>
                    <strong>Proportion:</strong>{' '}
                    {(building['Proportion of Total Students'] * 100).toFixed(2)}%
                  </p>
                  <p>
                    <strong>Day:</strong> {building.Day}
                  </p>
                  <p>
                    <strong>Time:</strong> {building['Time Slot']}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Layer 2: Cluster Hotspots (Large Pulsating Red Markers) */}
          {filteredHotspots.map((hotspot, index) => {
            const radius = 30 + hotspot.Hotspot_Proportion * 300;
            return (
              <CircleMarker
                key={`hotspot-${index}`}
                center={[hotspot.Hotspot_Latitude, hotspot.Hotspot_Longitude]}
                radius={radius}
                pathOptions={{
                  fillColor: '#dc3545',
                  fillOpacity: 0.4,
                  color: '#c82333',
                  weight: 2,
                }}
                className="pulsating-hotspot"
              >
                <Popup>
                  <div className="popup-content">
                    <h4>🔥 Hotspot Alert</h4>
                    <p>
                      <strong>Cluster:</strong> {hotspot.Cluster_ID}
                    </p>
                    <p>
                      <strong>Congestion:</strong>{' '}
                      {(hotspot.Hotspot_Proportion * 100).toFixed(2)}%
                    </p>
                    <p>
                      <strong>Day:</strong> {hotspot.Day}
                    </p>
                    <p>
                      <strong>Time:</strong> {hotspot['Time Slot']}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default AggieFlowMap;

