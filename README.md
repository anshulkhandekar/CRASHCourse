# 📡 CRASHCourse - Campus Traffic Visualization

A real-time campus traffic visualization tool built with React, Next.js, and Leaflet that displays building-level traffic and congestion hotspots on an interactive map.

![CRASHCourse Preview](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React](https://img.shields.io/badge/React-18.2-blue)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## ✨ Features

### 📍 Multi-Layer Visualization
- **Individual Buildings**: Small green markers showing building-level traffic
- **Cluster Hotspots**: Large pulsating red markers indicating major congestion zones
- **🚨 User Collision Reports**: Interactive collision reporting with animated Miss Rev mascot icons

### 🎛️ Interactive Controls
- Filter by day of the week (Monday-Friday)
- **🛹 Skater-Slider**: Custom time slider with Miss Rev mascot thumb
  - Dynamic time slots (50-min for MWF, 75-min for TTH)
  - Visual tic marks with 12-hour AM/PM format
  - Maroon/white gradient track
- **🎨 Theme Selector**: Toggle between Normal and Dark Mode
  - Reduces eye strain in low-light environments
  - Inverted dark theme with smart UI preservation
- **ℹ️ Info Button**: Accessible help modal with usage instructions
- Real-time data filtering and updates

### 🎨 Visual Design
- **📡 CRASHCourse Banner**: Animated top banner with bounce entrance effect
- **Pulsating Animation**: Hotspot markers pulse to indicate high-traffic areas
  - ⚠️ **Important**: Animation targets inner SVG `<path>` to avoid Leaflet positioning conflicts
- **Dynamic Sizing**: Hotspot size scales with congestion level
- **Color Coding**: Green for buildings, red for congestion alerts, orange for collision reports
- **Theme Support**: Normal (light) and Dark Mode themes
- **Responsive UI**: Works on desktop and mobile devices

### 🗺️ Map Features
- Zoom and pan controls
- Click markers for detailed information
- **Interactive collision reporting** - Click anywhere on the map to report incidents
- Popup displays showing:
  - Building names
  - Cluster IDs
  - Traffic proportions
  - Time and day information
  - Collision report details
- **Miss Rev mascot animations** - Adorable animated icons watching over collision sites

## 📊 Data Visualization

### Building Layer
- **Marker Type**: CircleMarker
- **Radius**: 5 (fixed)
- **Color**: Green (#28a745)
- **Data**: 57 individual buildings across campus

### Hotspot Layer
- **Marker Type**: CircleMarker with pulsating animation
- **Radius**: Dynamic - `30 + (Hotspot_Proportion × 300)`
- **Color**: Red (#dc3545)
- **Animation**: 2-second pulse cycle
- **Data**: Major congestion zones and clusters

## 🏗️ Project Structure

```
Howdy_Hack/
├── components/
│   ├── AggieFlowMap.jsx       # Main map component
│   └── README.md              # Component documentation
├── pages/
│   ├── _app.jsx               # Next.js app wrapper
│   └── index.jsx              # Home page
├── styles/
│   └── globals.css            # Global styles and animations
├── public/
│   ├── Aggie_Flow_Dataset.json           # Building data (57 buildings)
│   └── AggieFlow_Cluster_Hotspots.json   # Hotspot data
├── package.json               # Dependencies
├── next.config.js             # Next.js configuration
├── SETUP.md                   # Detailed setup guide
└── README.md                  # This file
```

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Step-by-Step Setup

1. **Navigate to project directory**
   ```bash
   cd Howdy_Hack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify data files** (already copied to `public/`)
   - `Aggie_Flow_Dataset.json` (Building data)
   - `AggieFlow_Cluster_Hotspots.json` (Hotspot data)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Basic Usage
Simply open the application and use the controls to filter by day and time. The map will automatically update to show:
- Green markers for individual buildings
- Red pulsating markers for congestion hotspots
- Miss Rev icons for user-reported collision sites

### Interacting with the Map
1. **Get Help**: Click the ℹ️ info button (top left) for detailed instructions
2. **Choose Theme**: Use the 🎨 Theme selector (top right) to toggle Normal/Dark Mode
3. **Select Day**: Use the day dropdown in the control panel
4. **Navigate Time**: Use the Skater-Slider to slide through time slots (Miss Rev moves along the track!)
5. **Report Collisions**: Click "Report Collision 🚨" then click anywhere on the map to mark a hazard
6. **View Details**: Click any marker to see detailed information
7. **Hover Miss Rev**: Hover over Miss Rev collision icons to zoom in and see details
8. **REV-solve**: Click a Miss Rev marker and use the "REV-solve Collision" button to clear it
9. **Navigate**: Zoom and pan to explore different areas

## 📋 Data Format

### Building Data Structure
```json
{
  "Building Name": "ACAD",
  "Day": "Monday",
  "Time Slot": "12:40-13:30",
  "Proportion of Total Students": 0.025,
  "Latitude": 30.61578,
  "Longitude": -96.34075
}
```

### Hotspot Data Structure
```json
{
  "Day": "Monday",
  "Time Slot": "12:40-13:30",
  "Cluster_ID": "Cluster_Central_Eng",
  "Hotspot_Proportion": 0.378,
  "Hotspot_Latitude": 30.61768,
  "Hotspot_Longitude": -96.33989
}
```

## 🎨 Customization

### Change Map Center/Zoom
Edit `components/AggieFlowMap.jsx`:
```jsx
<MapContainer
  center={[30.6174, -96.3402]}  // Your coordinates
  zoom={14}                      // Your zoom level
/>
```

### Modify Hotspot Sizing
Edit the radius calculation in `AggieFlowMap.jsx`:
```jsx
const radius = 30 + (hotspot.Hotspot_Proportion * 300);
```

### Adjust Pulsating Speed
Edit `styles/globals.css`:
```css
animation: pulse 2s infinite ease-in-out;  /* Change 2s to your preference */
```

### Change Colors
Building markers (line ~175):
```jsx
pathOptions={{
  fillColor: '#28a745',  // Your color
  color: '#1e7e34'       // Your border color
}}
```

Hotspot markers (line ~194):
```jsx
pathOptions={{
  fillColor: '#dc3545',  // Your color
  color: '#c82333'       // Your border color
}}
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14.0
- **UI Library**: React 18.2
- **Mapping**: React Leaflet 4.2.1 + Leaflet 1.9.4
- **Styling**: CSS-in-JS (styled-jsx) + CSS Modules
- **Data Format**: JSON

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🚨 Troubleshooting

### Map not displaying
- Ensure Leaflet CSS is imported
- Check that the component uses dynamic import (SSR disabled)
- Verify data files exist in `public/` folder

### Data not loading
- Open browser console for errors
- Verify JSON files are valid
- Check network tab for failed requests

### Pulsating animation not working
- Verify CSS animation is defined in `globals.css`
- Clear browser cache
- Check className is applied to hotspot markers

### Development server won't start
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check for port conflicts (default: 3000)

## 📈 Performance

- **Initial Load**: ~2-3 seconds (depending on data size)
- **Filtering**: Instant client-side updates
- **Map Rendering**: Optimized with React Leaflet
- **Data Size**: 
  - Building data: ~130k tokens
  - Hotspot data: ~900 entries

## 🔮 Future Enhancements

- [ ] Marker clustering for dense areas
- [ ] Heatmap layer option
- [ ] Route planning between buildings
- [ ] Historical data comparison
- [ ] Time-series animation
- [ ] CSV export functionality
- [ ] Mobile app version
- [ ] Real-time data integration

## 📄 Documentation

### Setup & Usage
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [Component README](./components/README.md) - Component API documentation

### Technical Documentation
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Next.js Docs](https://nextjs.org/docs)

## 🤝 Contributing

This is our HowdyHack 25' project. Feel free to fork and modify for your own use!

## 📝 License

MIT License - See LICENSE file for details

## 🎓 About

Built for visualizing campus traffic patterns at Texas A&M University. This tool helps students, faculty, and administrators understand building utilization and congestion patterns throughout the week.

**Developed with ❤️ by the HowdyHack Team**

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For component documentation, see [components/README.md](./components/README.md)
