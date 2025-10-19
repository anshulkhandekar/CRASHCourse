# AggieFlow Map Setup Guide

## Overview
AggieFlow is a React Leaflet-based visualization tool that displays campus traffic data with two layers:
1. **Individual Buildings** - Small green markers showing building-level traffic
2. **Cluster Hotspots** - Large pulsating red markers showing major congestion zones

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   cd Howdy_Hack
   npm install
   ```

2. **Move Data Files to Public Directory**
   
   Create a `public` folder if it doesn't exist, then copy your JSON data files:
   ```bash
   mkdir -p public
   cp ../Aggie_Flow_Dataset.json public/
   cp ../AggieFlow_Cluster_Hotspots.json public/
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   
   Navigate to: http://localhost:3000

## Project Structure

```
Howdy_Hack/
├── components/
│   └── AggieFlowMap.jsx       # Main map component
├── pages/
│   ├── _app.jsx               # App wrapper
│   └── index.jsx              # Home page
├── styles/
│   └── globals.css            # Global styles
├── public/
│   ├── Aggie_Flow_Dataset.json           # Building data
│   └── AggieFlow_Cluster_Hotspots.json   # Hotspot data
├── package.json
└── next.config.js
```

## Features

### Data Filtering
- **Day Selection**: Filter by day of the week (Monday-Friday)
- **Time Selection**: Filter by time slot (8:00-18:10)
- Real-time data filtering based on selections

### Map Layers

#### Layer 1: Individual Buildings
- Small CircleMarkers (radius: 5)
- Green color (#28a745)
- Shows building name and proportion on click

#### Layer 2: Cluster Hotspots
- Large CircleMarkers with dynamic sizing: `radius = 30 + (Hotspot_Proportion * 300)`
- Red color (#dc3545) with pulsating animation
- Shows cluster ID and congestion level on click

### Interactive Features
- Click markers to view detailed information
- Zoom and pan to explore the campus
- Responsive controls panel
- Legend for easy identification

## Data Format

### Building Data (Aggie_Flow_Dataset.json)
```json
{
  "Building Name": "string",
  "Day": "string",
  "Time Slot": "string",
  "Proportion of Total Students": number,
  "Latitude": number,
  "Longitude": number
}
```

### Cluster Hotspots (AggieFlow_Cluster_Hotspots.json)
```json
{
  "Day": "string",
  "Time Slot": "string",
  "Cluster_ID": "string",
  "Hotspot_Proportion": number,
  "Hotspot_Latitude": number,
  "Hotspot_Longitude": number
}
```

## Customization

### Colors
Edit the `pathOptions` in `AggieFlowMap.jsx`:
- Buildings: Line 175-180
- Hotspots: Line 194-199

### Pulsating Animation
Adjust timing in `globals.css` or inline styles:
```css
animation: pulse 2s infinite ease-in-out;
```

### Map Center & Zoom
Edit `MapContainer` props in `AggieFlowMap.jsx`:
```jsx
<MapContainer
  center={[30.6174, -96.3402]}  // Texas A&M coordinates
  zoom={14}
/>
```

## Troubleshooting

### Map Not Displaying
- Ensure Leaflet CSS is imported
- Check that the component is dynamically imported (SSR disabled)
- Verify data files are in the `public` folder

### Data Not Loading
- Check browser console for fetch errors
- Verify JSON file paths match the fetch URLs
- Ensure files are properly formatted JSON

### Pulsating Animation Not Working
- Check that the CSS animation is defined in globals.css
- Verify the className is applied to hotspot markers
- Clear browser cache and reload

## Performance Tips

- The component filters data client-side, so larger datasets may cause delays
- Consider implementing pagination or clustering for very large datasets
- Use React.memo() for optimization if needed

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - Feel free to modify and use for your projects!

