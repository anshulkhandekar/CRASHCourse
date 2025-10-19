# 🗺️ Reveille's Radar Component Architecture

## Visual Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Reveille's RadarMap                             │
│                      (Main Component)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│   State      │    │  Effects     │      │   Render     │
│ Management   │    │  (useEffect) │      │    JSX       │
└──────────────┘    └──────────────┘      └──────────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│selectedDay   │    │ Load Data    │      │Control Panel │
│selectedTime  │    │ Filter Data  │      │Legend Panel  │
│buildingData  │    │              │      │Map Container │
│clusterHotspots│   │              │      └──────────────┘
│filteredXXX   │    │              │              │
└──────────────┘    └──────────────┘              │
                                          ┌───────┴────────┐
                                          │                │
                                          ▼                ▼
                                  ┌──────────────┐ ┌──────────────┐
                                  │   Layer 1    │ │   Layer 2    │
                                  │  Buildings   │ │  Hotspots    │
                                  │  (Green)     │ │  (Red Pulse) │
                                  └──────────────┘ └──────────────┘
```

---

## Component Hierarchy

```
<div className="aggie-flow-container">
  │
  ├── <style jsx>
  │   └── All CSS including pulsating animation
  │
  ├── <div className="controls">
  │   ├── Day Dropdown
  │   └── Time Dropdown
  │
  ├── <div className="info-panel">
  │   └── Legend Items
  │
  └── <MapContainer>
      ├── <TileLayer>
      │
      ├── {filteredBuildings.map()}
      │   └── <CircleMarker>
      │       └── <Popup>
      │
      └── {filteredHotspots.map()}
          └── <CircleMarker className="pulsating-hotspot">
              └── <Popup>
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    INITIAL LOAD                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │    useEffect(() => {...}, [])    │
        │      (On Component Mount)        │
        └─────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────┐            ┌─────────────────┐
│  Fetch Building │            │ Fetch Cluster   │
│     Data JSON   │            │  Hotspots JSON  │
└─────────────────┘            └─────────────────┘
         │                                 │
         └────────────────┬────────────────┘
                          ▼
                 ┌─────────────────┐
                 │  Store in State │
                 │  buildingData   │
                 │ clusterHotspots │
                 └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  USER INTERACTION                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │  User Changes Day or Time      │
         │  via Dropdown                  │
         └────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │  setState(newDay/newTime)      │
         └────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  useEffect(() => {...}, [selectedDay, selectedTime])    │
│              (Filtering Effect)                          │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────┐            ┌─────────────────┐
│ Filter Building │            │ Filter Cluster  │
│      Data       │            │    Hotspots     │
│                 │            │                 │
│ Match Day &     │            │ Match Day &     │
│ Time Slot       │            │ Time Slot       │
└─────────────────┘            └─────────────────┘
         │                                 │
         └────────────────┬────────────────┘
                          ▼
                 ┌─────────────────┐
                 │  Store Filtered │
                 │  filteredXXX    │
                 └─────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   RE-RENDER MAP                          │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────┐            ┌─────────────────┐
│  Render Green   │            │  Render Red     │
│    Building     │            │   Pulsating     │
│    Markers      │            │    Markers      │
└─────────────────┘            └─────────────────┘
```

---

## State Variables

```javascript
// Selection State
const [selectedDay, setSelectedDay] = useState('Monday');
const [selectedTime, setSelectedTime] = useState('12:40-13:30');

// Raw Data State
const [buildingData, setBuildingData] = useState([]);
const [clusterHotspots, setClusterHotspots] = useState([]);

// Filtered Data State
const [filteredBuildings, setFilteredBuildings] = useState([]);
const [filteredHotspots, setFilteredHotspots] = useState([]);
```

---

## Effect Dependencies

```
┌────────────────────────────────────────────────────┐
│  Effect 1: Data Loading                            │
│  useEffect(() => {...}, [])                        │
│  ├─ Triggers: On component mount                   │
│  ├─ Dependencies: None                             │
│  └─ Actions:                                       │
│     - Fetch building data                          │
│     - Fetch cluster hotspots                       │
│     - Update state                                 │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Effect 2: Data Filtering                          │
│  useEffect(() => {...}, [dependencies])            │
│  ├─ Triggers: When any dependency changes          │
│  ├─ Dependencies:                                  │
│  │  - selectedDay                                  │
│  │  - selectedTime                                 │
│  │  - buildingData                                 │
│  │  - clusterHotspots                              │
│  └─ Actions:                                       │
│     - Filter buildingData → filteredBuildings      │
│     - Filter clusterHotspots → filteredHotspots    │
└────────────────────────────────────────────────────┘
```

---

## Rendering Logic

```javascript
// LAYER 1: Individual Buildings
filteredBuildings.map((building, index) => (
  <CircleMarker
    key={`building-${index}`}
    center={[building.Latitude, building.Longitude]}
    radius={5}
    pathOptions={{
      fillColor: '#28a745',
      fillOpacity: 0.6,
      color: '#1e7e34',
      weight: 1
    }}
  >
    <Popup>
      {/* Building Name, Proportion, Day, Time */}
    </Popup>
  </CircleMarker>
))

// LAYER 2: Cluster Hotspots
filteredHotspots.map((hotspot, index) => {
  const radius = 30 + (hotspot.Hotspot_Proportion * 300);
  return (
    <CircleMarker
      key={`hotspot-${index}`}
      center={[hotspot.Hotspot_Latitude, hotspot.Hotspot_Longitude]}
      radius={radius}
      pathOptions={{
        fillColor: '#dc3545',
        fillOpacity: 0.4,
        color: '#c82333',
        weight: 2
      }}
      className="pulsating-hotspot"
    >
      <Popup>
        {/* Cluster ID, Congestion %, Day, Time */}
      </Popup>
    </CircleMarker>
  );
})
```

---

## CSS Animation Flow

```
┌────────────────────────────────────────────────────┐
│  1. Define Keyframes                               │
│                                                    │
│  @keyframes pulse {                                │
│    0%   → scale(1.0), opacity(1.0)                │
│    50%  → scale(1.2), opacity(0.7)                │
│    100% → scale(1.0), opacity(1.0)                │
│  }                                                 │
└────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────┐
│  2. Create Animation Class                         │
│                                                    │
│  .pulsating-hotspot {                              │
│    animation: pulse 2s infinite ease-in-out;       │
│  }                                                 │
└────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────┐
│  3. Apply to CircleMarker                          │
│                                                    │
│  <CircleMarker className="pulsating-hotspot" />    │
└────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────┐
│  4. Browser Renders Animation                      │
│                                                    │
│  ┌───┐  ┌────┐  ┌─────┐  ┌────┐  ┌───┐          │
│  │ ● │→ │ ●  │→ │  ●  │→ │ ●  │→ │ ● │ (repeat) │
│  └───┘  └────┘  └─────┘  └────┘  └───┘          │
│   1.0    1.1     1.2     1.1     1.0             │
└────────────────────────────────────────────────────┘
```

---

## User Interaction Flow

```
User Opens App
      │
      ▼
┌─────────────────┐
│  Default State  │
│  Day: Monday    │
│  Time: 12:40    │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Map Loads with  │
│ Default Filters │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  User Clicks    │
│  Day Dropdown   │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Select "Friday" │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ State Updates   │
│ Filters Run     │
│ Map Re-renders  │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  User Clicks    │
│  Green Marker   │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Popup Shows    │
│ Building Details│
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  User Clicks    │
│  Red Marker     │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Popup Shows    │
│ Hotspot Details │
└─────────────────┘
```

---

## Performance Optimization

```
┌────────────────────────────────────────────────────┐
│  Data Loading (Once)                               │
│  ├─ Fetch on mount: O(1)                          │
│  └─ Store in state: O(n)                          │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Filtering (On Change)                             │
│  ├─ Filter buildings: O(n)                        │
│  └─ Filter hotspots: O(m)                         │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Rendering (After Filter)                          │
│  ├─ Render buildings: O(k)  [k = filtered count]  │
│  ├─ Render hotspots: O(l)   [l = filtered count]  │
│  └─ Total: O(k + l)  [typically < 100 markers]    │
└────────────────────────────────────────────────────┘
```

---

## File Import Chain

```
pages/index.jsx
    │
    │ import (dynamic, SSR disabled)
    │
    ▼
components/Reveille's RadarMap.jsx
    │
    ├─→ import { MapContainer, TileLayer, CircleMarker, Popup }
    │   from 'react-leaflet'
    │
    ├─→ import 'leaflet/dist/leaflet.css'
    │
    └─→ Uses <style jsx> for component styles
        (includes pulsating animation)

pages/_app.jsx
    │
    └─→ import '../styles/globals.css'
        (global styles + animations)
```

---

## Component Lifecycle

```
1. Component Mount
   └─> useEffect (data loading)
       └─> Fetch JSON files
           └─> Update state (buildingData, clusterHotspots)

2. State Update (data loaded)
   └─> useEffect (filtering)
       └─> Filter data
           └─> Update state (filteredBuildings, filteredHotspots)

3. State Update (filtered data ready)
   └─> Re-render
       └─> Map markers
           └─> Display on map

4. User Interaction (dropdown change)
   └─> setState (selectedDay/selectedTime)
       └─> useEffect (filtering) [Go to step 2]

5. User Click (marker)
   └─> Leaflet handles popup
       └─> Display popup content
```

---

## Styling Architecture

```
Global Styles (globals.css)
    ├─ Reset & base styles
    ├─ Leaflet container sizing
    ├─ Pulse animation keyframes
    └─ Color variables

Component Styles (<style jsx>)
    ├─ .aggie-flow-container
    ├─ .controls (top-right panel)
    ├─ .control-group (dropdowns)
    ├─ .info-panel (legend, bottom-left)
    ├─ .legend-item
    ├─ .popup-content
    └─ .pulsating-hotspot (animation class)

Extended Animations (animations.css)
    ├─ pulse (standard)
    ├─ pulse-slow
    ├─ pulse-fast
    ├─ ripple
    ├─ fadeIn
    ├─ popIn
    └─ ... more variants
```

---

This architecture provides a clear separation of concerns, efficient data flow, and optimal rendering performance for the Reveille's Radar map visualization.

