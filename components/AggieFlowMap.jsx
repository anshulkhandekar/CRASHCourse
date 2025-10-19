import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Map Click Handler Component
const MapClickHandler = ({ isReportingMode, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (isReportingMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const AggieFlowMap = () => {
  // State variables
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('8:00-8:50');
  const [buildingData, setBuildingData] = useState([]);
  const [clusterHotspots, setClusterHotspots] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [filteredHotspots, setFilteredHotspots] = useState([]);
  
  // Collision reporting state
  const [userReports, setUserReports] = useState([]);
  const [isReportingMode, setIsReportingMode] = useState(false);
  const [reportIdCounter, setReportIdCounter] = useState(1);

  // Days for dropdown
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Time slot definitions - MWF (50-minute) vs TTH (75-minute)
  const MWF_TIMES = [
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
  
  const TTH_TIMES = [
    '8:00-9:15',
    '9:35-10:50',
    '11:10-12:25',
    '12:45-14:00',
    '14:20-15:35',
    '15:55-17:10',
    '17:30-18:45'
  ];
  
  // Dynamic time slots based on selected day
  const availableTimes = (selectedDay === 'Tuesday' || selectedDay === 'Thursday') 
    ? TTH_TIMES 
    : MWF_TIMES;
  
  // Get current time slot index for slider
  const currentTimeIndex = availableTimes.indexOf(selectedTime);

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

  // CRITICAL FIX: Reset time to first slot when day changes (fixes TTH loading issue)
  useEffect(() => {
    const newAvailableTimes = (selectedDay === 'Tuesday' || selectedDay === 'Thursday') 
      ? TTH_TIMES 
      : MWF_TIMES;
    
    // If current time is not in the new available times, reset to first slot
    if (!newAvailableTimes.includes(selectedTime)) {
      setSelectedTime(newAvailableTimes[0]);
    }
  }, [selectedDay]);

  // Update slider gradient when time or day changes
  useEffect(() => {
    const slider = document.getElementById('time-slider');
    if (slider && currentTimeIndex !== -1) {
      const progress = (currentTimeIndex / (availableTimes.length - 1)) * 100;
      slider.style.setProperty('--slider-progress', `${progress}%`);
    }
  }, [currentTimeIndex, availableTimes.length]);

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

  // Handle map click for collision reporting
  const handleMapClick = (latlng) => {
    const newReport = {
      id: reportIdCounter,
      lat: latlng.lat,
      lng: latlng.lng,
      missRevImage: Math.random() < 0.5 ? '/InjuredMissRev.jpg' : '/injuredskatemissrev.jpg'
    };
    setUserReports([...userReports, newReport]);
    setReportIdCounter(reportIdCounter + 1);
    // Auto-disable reporting mode after placing a marker
    setIsReportingMode(false);
  };

  // Remove/resolve a collision report
  const handleResolveCollision = (reportId) => {
    setUserReports(userReports.filter(report => report.id !== reportId));
  };

  // Handle slider change for time selection
  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setSelectedTime(availableTimes[newIndex]);
    
    // Update slider gradient progress
    const progress = (newIndex / (availableTimes.length - 1)) * 100;
    e.target.style.setProperty('--slider-progress', `${progress}%`);
  };

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTime12Hour = (time24) => {
    const [hours24, minutes] = time24.split(':').map(num => parseInt(num));
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12; // Convert 0 to 12 for midnight
    return { time: `${hours12}:${minutes.toString().padStart(2, '0')}`, period };
  };

  // Convert full time range to 12-hour format (e.g., "13:50-14:40" -> "1:50-2:40 PM")
  const formatTimeRange12Hour = (timeRange) => {
    const [startTime, endTime] = timeRange.split('-');
    const start = formatTime12Hour(startTime);
    const end = formatTime12Hour(endTime);
    
    // If both times have same period, only show it once at the end
    if (start.period === end.period) {
      return `${start.time}-${end.time} ${end.period}`;
    } else {
      return `${start.time} ${start.period}-${end.time} ${end.period}`;
    }
  };

  // Info modal state
  const [showInfo, setShowInfo] = useState(false);

  // Theme state (normal or dark)
  const [theme, setTheme] = useState('normal');

  // Create custom Miss Rev icon as the collision marker itself
  const createMissRevIcon = (imageUrl) => {
    return L.divIcon({
      html: `<div class="miss-rev-collision-wrapper">
               <img src="${imageUrl}" alt="Miss Rev" class="miss-rev-collision-img" />
             </div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
      className: 'miss-rev-collision-marker'
    });
  };

  useEffect(() => {
    setShowInfo(true);
  }, []);

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

        /* Miss Rev shake animation */
        @keyframes shake-side {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(-3px) rotate(-1deg);
          }
          75% {
            transform: translateX(3px) rotate(1deg);
          }
        }

        /* Miss Rev as Collision Marker - Pulsating Animation */
        :global(.miss-rev-collision-marker) {
          width: 50px !important;
          height: 50px !important;
          background: none !important;
          border: none !important;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        :global(.miss-rev-collision-wrapper) {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-fast 1s infinite ease-in-out;
        }

        :global(.miss-rev-collision-img) {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #ff6b35;
          box-shadow: 0 0 15px rgba(255, 107, 53, 0.6);
          display: block;
          transition: all 0.3s ease;
        }

        /* Hover effect - Make Miss Rev bigger to see details */
        :global(.miss-rev-collision-marker:hover .miss-rev-collision-img) {
          transform: scale(1.8);
          border-width: 4px;
          box-shadow: 0 0 25px rgba(255, 107, 53, 0.9);
          z-index: 1000;
        }

        /* Pause pulsating on hover so user can see details clearly */
        :global(.miss-rev-collision-marker:hover .miss-rev-collision-wrapper) {
          animation-play-state: paused;
        }

        /* Report button styling */
        .report-button {
          padding: 12px 20px;
          background-color: #ff6b35;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
        }

        .report-button:hover {
          background-color: #ff5722;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
        }

        .report-button.active {
          background-color: #4caf50;
          animation: pulse-button 1.5s infinite;
        }

        @keyframes pulse-button {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
          }
          50% {
            box-shadow: 0 4px 16px rgba(76, 175, 80, 0.6);
          }
        }

        .report-status {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
          font-style: italic;
        }

        /* Skater-Slider Styling */
        .skater-slider-container {
          padding: 20px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          padding: 15px;
        }

        .skater-slider-container label {
          font-size: 16px;
          font-weight: 700;
          color: #500000;
          margin-bottom: 10px;
          display: block;
        }

        .current-time-display {
          background: #500000;
          color: white;
          padding: 10px 15px;
          border-radius: 6px;
          margin: 10px 0;
          text-align: center;
          font-weight: 600;
        }

        .time-label {
          font-size: 12px;
          opacity: 0.9;
          margin-right: 8px;
        }

        .time-value {
          font-size: 18px;
          font-weight: 700;
        }

        .slider-wrapper {
          position: relative;
          padding: 20px 10px 60px 10px;
        }

        /* Custom Range Slider with Miss Rev Thumb */
        .miss-rev-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, 
            #500000 0%, 
            #500000 var(--slider-progress, 50%), 
            #ffffff var(--slider-progress, 50%), 
            #ffffff 100%);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
        }

        /* Webkit browsers (Chrome, Safari) */
        .miss-rev-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background-image: url('/MissRevSlider.png');
          background-size: 85%;
          background-position: center;
          background-repeat: no-repeat;
          background-color: white;
          cursor: grab;
          border: 3px solid #500000;
          box-shadow: 0 2px 10px rgba(80, 0, 0, 0.5);
          transition: transform 0.2s ease;
        }

        .miss-rev-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .miss-rev-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.05);
        }

        /* Firefox */
        .miss-rev-slider::-moz-range-thumb {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background-image: url('/MissRevSlider.png');
          background-size: 85%;
          background-position: center;
          background-repeat: no-repeat;
          background-color: white;
          cursor: grab;
          border: 3px solid #500000;
          box-shadow: 0 2px 10px rgba(80, 0, 0, 0.5);
          transition: transform 0.2s ease;
        }

        .miss-rev-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
        }

        .miss-rev-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.05);
        }

        /* Firefox track */
        .miss-rev-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #ffffff;
        }

        /* Tic Marks and Labels */
        .slider-tics {
          position: relative;
          width: 100%;
          height: 30px;
          margin-top: 8px;
        }

        .tic-mark {
          position: absolute;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tic-line {
          width: 2px;
          height: 8px;
          background-color: #ccc;
          margin-bottom: 3px;
        }

        .tic-mark.active .tic-line {
          width: 3px;
          height: 12px;
          background-color: #500000;
        }

        .tic-label {
          font-size: 9px;
          color: #666;
          white-space: nowrap;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

        .tic-period {
          font-size: 7px;
          font-weight: 600;
          margin-top: 1px;
        }

        .tic-mark.active .tic-label {
          font-size: 10px;
          color: #500000;
          font-weight: 700;
        }

        .tic-mark.active .tic-period {
          font-size: 8px;
        }

        .schedule-type {
          text-align: center;
          font-size: 12px;
          color: #500000;
          font-weight: 600;
          margin-top: 2px;
          padding: 6px;
          background: rgba(80, 0, 0, 0.1);
          border-radius: 4px;
        }

        /* REV-solve button styling */
        .resolve-button {
          padding: 8px 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .resolve-button:hover {
          background-color: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
        }

        .resolve-button:active {
          transform: translateY(0);
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
        /* Info Button */
        .info-button {
          position: absolute;
          top: 80px;
          left: 10px;
          z-index: 1000;
          width: 40px;
          height: 40px;
          background: white;
          border: 2px solid #500000;
          border-radius: 4px;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }

        .info-button:hover {
          background: #500000;
          transform: scale(1.1);
        }

        /* Info Modal */
        .info-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .info-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: relative;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .close-modal {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
          line-height: 1;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-modal:hover {
          background: #f0f0f0;
          color: #500000;
        }

        .info-modal h2 {
          color: #500000;
          margin: 0 0 20px 0;
          font-size: 24px;
          text-align: center;
        }

        .info-content {
          color: #333;
        }

        .info-content section {
          margin-bottom: 20px;
        }

        .info-content h3 {
          color: #500000;
          font-size: 18px;
          margin: 0 0 10px 0;
        }

        .info-content ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-content li {
          margin: 8px 0;
          line-height: 1.6;
        }

        .info-content p {
          margin: 5px 0;
          line-height: 1.6;
        }

        .info-content strong {
          font-weight: 600;
        }

        /* CRASHCourse Banner */
        .app-banner {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          border: none;
          animation: bannerEntrance 0.8s ease-out, bannerPulse 3s ease-in-out infinite 1s;
        }

        @keyframes bannerEntrance {
          0% {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
          }
          60% {
            transform: translateX(-50%) translateY(5px);
          }
          100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        @keyframes bannerPulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
          50% {
            transform: translateX(-50%) scale(1.05);
            filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5));
          }
        }

        .banner-image {
          height: 40px;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          object-fit: cover;
          object-position: center;
        }

        /* Theme Selector */
        .theme-selector {
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid #500000;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .theme-selector label {
          font-size: 12px;
          font-weight: 600;
          color: #500000;
          margin: 0;
        }

        .theme-selector select {
          padding: 4px 8px;
          border: 1px solid #500000;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          background: white;
          color: #500000;
          font-weight: 500;
        }

        /* Dark Theme */
        .map-container.dark-theme {
          filter: invert(0.9) hue-rotate(180deg);
        }

        .map-container.dark-theme .controls,
        .map-container.dark-theme .info-button,
        .map-container.dark-theme .theme-selector,
        .map-container.dark-theme .app-banner,
        .map-container.dark-theme .report-button {
          filter: invert(1) hue-rotate(-180deg);
        }
      `}</style>

      {/* CRASHCourse Banner */}
      <div className="app-banner">
        <img src="/CrashCourseBanner.png" alt="CRASHCourse" className="banner-image" />
      </div>


      {/* Info Button */}
      <button className="info-button" onClick={() => setShowInfo(true)}>
        ℹ️
      </button>

      {/* Info Modal */}
      {showInfo && (
        <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowInfo(false)}>✕</button>
            <h2>📡 Welcome to CRASHCourse!</h2>
            <div className="info-content">
              <section>
                <h3>📍 How to Use:</h3>
                <ul>
                  <li><strong>Select Day & Time:</strong> Use the dropdowns to see campus traffic patterns</li>
                  <li><strong>Skater-Slider:</strong> Slide Miss Rev through time to see how traffic changes</li>
                  <li><strong>Report Collisions:</strong> Click "Report Collision 🚨" then click on the map to mark a hazard</li>
                  <li><strong>Hover over Miss Rev:</strong> When you see Miss Rev at a collision site, hover to zoom in!</li>
                  <li><strong>REV-solve:</strong> Click on a Miss Rev marker and use the "REV-solve Collision" button to clear it</li>
                </ul>
              </section>
              <section>
                <h3>🎨 Understanding the Map:</h3>
                <ul>
                  <li><strong style={{ color: '#28a745' }}>🟢 Green Circles:</strong> Individual buildings with foot traffic</li>
                  <li><strong style={{ color: '#dc3545' }}>🔴 Large Pulsating Red:</strong> Major congestion hotspots (bigger = more crowded)</li>
                  <li><strong style={{ color: '#ff6b35' }}>🐶 Miss Rev Icons:</strong> User-reported collision sites that need attention</li>
                </ul>
              </section>
              <section>
                <h3>📚 Class Schedules:</h3>
                <p><strong>MWF:</strong> 50-minute classes (Monday, Wednesday, Friday)</p>
                <p><strong>TTH:</strong> 75-minute classes (Tuesday, Thursday)</p>
              </section>
            </div>
          </div>
        </div>
      )}

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

        {/* Skater-Slider for Time Selection */}
        <div className="control-group skater-slider-container">
          <label htmlFor="time-slider">🛹 Skate Through Time:</label>
          
          {/* Current Time Display */}
          <div className="current-time-display">
            <span className="time-label">Time:</span>
            <span className="time-value">{formatTimeRange12Hour(selectedTime)}</span>
          </div>
          
          {/* Custom Slider with Miss Rev Thumb */}
          <div className="slider-wrapper">
            <input
              type="range"
              id="time-slider"
              className="miss-rev-slider"
              min={0}
              max={availableTimes.length - 1}
              value={currentTimeIndex === -1 ? 0 : currentTimeIndex}
              onChange={handleSliderChange}
              step={1}
            />
            
            {/* Tic Marks and Labels */}
            <div className="slider-tics">
              {availableTimes.map((time, index) => {
                const startTime = time.split('-')[0];
                const { time: time12, period } = formatTime12Hour(startTime);
                return (
                  <div
                    key={time}
                    className={`tic-mark ${index === currentTimeIndex ? 'active' : ''}`}
                    style={{ left: `${(index / (availableTimes.length - 1)) * 100}%` }}
                  >
                    <div className="tic-line"></div>
                    <div className="tic-label">
                      {time12}
                      <div className="tic-period">{period}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Schedule Type Indicator */}
          <div className="schedule-type">
            {(selectedDay === 'Tuesday' || selectedDay === 'Thursday') 
              ? '📚 TTH Schedule (75-min classes)' 
              : '📚 MWF Schedule (50-min classes)'}
          </div>
        </div>

        {/* Collision Reporting Button */}
        <div className="control-group">
          <button
            className={`report-button ${isReportingMode ? 'active' : ''}`}
            onClick={() => setIsReportingMode(!isReportingMode)}
          >
            🚨 {isReportingMode ? 'Click Map to Report' : 'Report Collision'}
          </button>
          {isReportingMode && (
            <div className="report-status">
              Click anywhere on the map to place a collision report
            </div>
          )}
          {userReports.length > 0 && (
            <div className="report-status">
              {userReports.length} collision{userReports.length > 1 ? 's' : ''} reported
            </div>
          )}
        </div>

        {/* Theme Selector */}
        <div className="theme-selector">
          <label htmlFor="theme-select">🎨 Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="dark">Dark Mode</option>
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
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff6b35' }}></div>
          <span className="legend-text">🐶 Miss Rev Collision Reports (hover to zoom)</span>
        </div>
      </div>

      {/* Map Container */}
      <div className={`map-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
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
                      <strong>Time:</strong> {formatTimeRange12Hour(hotspot['Time Slot'])}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Map Click Handler for Collision Reporting */}
          <MapClickHandler isReportingMode={isReportingMode} onMapClick={handleMapClick} />

          {/* Layer 3: User Reported Collisions - Miss Rev as the Collision Marker */}
          {userReports.map((report) => (
            <Marker
              key={`report-${report.id}`}
              position={[report.lat, report.lng]}
              icon={createMissRevIcon(report.missRevImage)}
            >
              <Popup>
                <div className="popup-content">
                  <h4>🐶 Miss Rev Collision Report #{report.id}</h4>
                  <p>
                    <strong>Location:</strong> {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
                  </p>
                  <p>
                    <strong>Status:</strong> User Reported
                  </p>
                  <p style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                    Miss Rev is watching over this collision site. Please use caution in this area.
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '5px' }}>
                    💡 Hover over Miss Rev to see her up close!
                  </p>
                  <button 
                    className="resolve-button"
                    onClick={() => handleResolveCollision(report.id)}
                  >
                    ✅ REV-solve Collision
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AggieFlowMap;

