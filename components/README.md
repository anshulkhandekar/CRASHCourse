# Reveille's RadarMap Component

## Description

The `Reveille's RadarMap` component is a dual-layer React Leaflet visualization that displays campus traffic patterns with real-time filtering capabilities.

## Features

### Dual Data Visualization
1. **Building Layer** - Green markers showing individual building traffic
2. **Hotspot Layer** - Pulsating red markers indicating major congestion zones

### Interactive Controls
- Day selection dropdown (Monday-Friday)
- Time slot selection (8:00 AM - 6:10 PM)
- Real-time data filtering

### Visual Effects
- **Pulsating Animation**: Hotspot markers pulse to draw attention to high-traffic areas
- **Dynamic Sizing**: Hotspot radius scales with congestion level: `radius = 30 + (proportion × 300)`
- **Color Coding**: Green for regular buildings, Red for congestion alerts

## Usage

```jsx
import Reveille's RadarMap from '../components/Reveille's RadarMap';

export default function Page() {
  return <Reveille's RadarMap />;
}
```

**Note**: Use dynamic import in Next.js to prevent SSR issues:

```jsx
import dynamic from 'next/dynamic';

const Reveille's RadarMap = dynamic(() => import('../components/Reveille's RadarMap'), {
  ssr: false
});
```

## Props

This component currently doesn't accept props. All configuration is handled internally with state management.

## Data Requirements

### Building Data (Aggie_Flow_Dataset.json)
Located in `/public/Aggie_Flow_Dataset.json`

Required fields:
- `Building Name`: string
- `Day`: string (Monday-Friday)
- `Time Slot`: string (e.g., "12:40-13:30")
- `Proportion of Total Students`: number (0-1)
- `Latitude`: number
- `Longitude`: number

### Hotspot Data (Reveille's Radar_Cluster_Hotspots.json)
Located in `/public/Reveille's Radar_Cluster_Hotspots.json`

Required fields:
- `Day`: string (Monday-Friday)
- `Time Slot`: string
- `Cluster_ID`: string
- `Hotspot_Proportion`: number (0-1)
- `Hotspot_Latitude`: number
- `Hotspot_Longitude`: number

## Styling

### CSS-in-JS
The component uses Next.js's `<style jsx>` for scoped styling with the following key elements:

- `.controls` - Control panel positioning and styling
- `.pulsating-hotspot` - Animation for hotspot markers
- `.popup-content` - Leaflet popup customization
- `.info-panel` - Legend and information display

### Animation
Pulsating effect defined with CSS keyframes:
```css
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* IMPORTANT: Target the inner SVG path to avoid Leaflet positioning conflicts */
.pulsating-hotspot > path {
  animation: pulse 2s infinite ease-in-out;
  transform-origin: center center;
}
```

**Important Note**: The animation targets the inner `<path>` element (`.pulsating-hotspot > path`) rather than the CircleMarker itself. This prevents CSS transform conflicts with Leaflet's positioning system, ensuring the marker stays in place while pulsating.

## Map Configuration

- **Center**: [30.6174, -96.3402] (Texas A&M University)
- **Initial Zoom**: 14
- **Tile Layer**: OpenStreetMap
- **Scroll Wheel Zoom**: Enabled

## Component Structure

```
Reveille's RadarMap
├── State Management (useState)
│   ├── selectedDay
│   ├── selectedTime
│   ├── buildingData
│   ├── clusterHotspots
│   ├── filteredBuildings
│   └── filteredHotspots
├── Data Loading (useEffect)
│   └── Fetch JSON files on mount
├── Filtering Logic (useEffect)
│   └── Filter data on selection change
└── Render
    ├── Control Panel
    ├── Legend Panel
    └── MapContainer
        ├── TileLayer
        ├── Building Markers
        └── Hotspot Markers
```

## Dependencies

- `react`: ^18.2.0
- `react-leaflet`: ^4.2.1
- `leaflet`: ^1.9.4
- `next`: ^14.0.0

## Customization Examples

### Change Map Center
```jsx
<MapContainer
  center={[YOUR_LAT, YOUR_LONG]}
  zoom={14}
/>
```

### Modify Hotspot Sizing Algorithm
```jsx
const radius = YOUR_BASE_SIZE + (hotspot.Hotspot_Proportion * YOUR_MULTIPLIER);
```

### Change Colors
```jsx
// Buildings
pathOptions={{
  fillColor: '#YOUR_COLOR',
  color: '#YOUR_BORDER_COLOR'
}}

// Hotspots
pathOptions={{
  fillColor: '#YOUR_COLOR',
  color: '#YOUR_BORDER_COLOR'
}}
```

### Adjust Animation Speed
```css
animation: pulse YOUR_DURATIONs infinite;
```

## Performance Considerations

- Client-side filtering may be slow with very large datasets (>10,000 records)
- Consider implementing:
  - Server-side filtering for large datasets
  - Marker clustering for dense areas
  - Pagination or lazy loading

## Known Issues

- Leaflet requires client-side rendering (SSR must be disabled)
- First load may be slow with large JSON files
- Animation performance may vary on older devices

## Future Enhancements

- [ ] Add marker clustering for dense areas
- [ ] Implement heatmap layer option
- [ ] Add route planning between buildings
- [ ] Export filtered data as CSV
- [ ] Add time-series animation
- [ ] Mobile-responsive controls

## License

MIT

