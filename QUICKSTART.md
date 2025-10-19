# 🚀 Reveille's Radar Quick Start Guide

Get up and running with Reveille's Radar in 5 minutes!

## ⚡ Fastest Setup (3 Commands)

```bash
cd /Users/anshulkhandekar/HowdyHack/Howdy_Hack
npm install
npm run dev
```

Then open: **http://localhost:3000**

## ✅ What You Get

A fully functional React Leaflet map with:
- ✨ **57 building markers** (green circles)
- 🔥 **Pulsating hotspot markers** (red circles)
- 📅 **Day filter** (Monday-Friday)
- ⏰ **Time filter** (8:00 AM - 6:10 PM)
- 🗺️ **Interactive map** (zoom, pan, click markers)
- 📊 **Real-time filtering** (instant updates)

## 📁 Project Structure Overview

```
Howdy_Hack/
├── components/Reveille's RadarMap.jsx    ← Main map component
├── pages/index.jsx                ← Home page
├── public/                        ← Data files (already set up)
│   ├── Aggie_Flow_Dataset.json
│   └── Reveille's Radar_Cluster_Hotspots.json
└── styles/                        ← CSS & animations
```

## 🎯 Key Features Explained

### Layer 1: Buildings (Green Markers)
- **Purpose**: Show individual building traffic
- **Size**: Small (radius 5)
- **Color**: Green (#28a745)
- **Click**: Shows building name + traffic proportion

### Layer 2: Hotspots (Red Pulsating Markers)
- **Purpose**: Show major congestion zones
- **Size**: Dynamic - bigger = more congestion
- **Formula**: `radius = 30 + (proportion × 300)`
- **Color**: Red (#dc3545)
- **Animation**: 2-second pulse
- **Click**: Shows cluster ID + congestion level

## 🎨 Visual Elements

### Control Panel (Top Right)
```
┌─────────────────────┐
│ Select Day: Monday ▼│
│ Select Time: 12:40 ▼│
└─────────────────────┘
```

### Legend (Bottom Left)
```
┌─────────────────────────┐
│ 🟢 Individual Buildings │
│ 🔴 Cluster Hotspots     │
└─────────────────────────┘
```

## 🔧 Common Customizations

### Change Map Center
**File**: `components/Reveille's RadarMap.jsx` (Line ~146)
```jsx
<MapContainer center={[30.6174, -96.3402]} zoom={14}>
```

### Adjust Hotspot Size
**File**: `components/Reveille's RadarMap.jsx` (Line ~188)
```jsx
const radius = 30 + (hotspot.Hotspot_Proportion * 300);
```

### Change Pulse Speed
**File**: `styles/globals.css` (Line ~29)
```css
animation: pulse 2s infinite ease-in-out;
```

### Modify Colors
**Buildings** (Line ~175):
```jsx
fillColor: '#28a745'  // Green
```

**Hotspots** (Line ~194):
```jsx
fillColor: '#dc3545'  // Red
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Map not showing | Check browser console, ensure data files in `public/` |
| Blank white screen | Run `npm install`, restart dev server |
| Port 3000 in use | Run `npm run dev -- -p 3001` |
| Data not filtering | Check dropdown values match data format |
| Animation not working | Clear browser cache, hard refresh (Cmd+Shift+R) |

## 📚 File Reference

### Core Files (You'll Edit These)
- `components/Reveille's RadarMap.jsx` - Main component
- `styles/globals.css` - Global styles
- `styles/animations.css` - Animation library

### Configuration (Usually Don't Touch)
- `package.json` - Dependencies
- `next.config.js` - Next.js config
- `pages/_app.jsx` - App wrapper

### Data Files (Read-Only)
- `public/Aggie_Flow_Dataset.json` - Building data
- `public/Reveille's Radar_Cluster_Hotspots.json` - Hotspot data

## 🎓 How It Works

### 1. Data Loading
```javascript
useEffect(() => {
  // Fetch both JSON files on component mount
  fetch('/Aggie_Flow_Dataset.json')
  fetch('/Reveille's Radar_Cluster_Hotspots.json')
}, [])
```

### 2. Filtering
```javascript
useEffect(() => {
  // Filter data when day/time changes
  const filtered = data.filter(
    item => item.Day === selectedDay && 
            item['Time Slot'] === selectedTime
  )
}, [selectedDay, selectedTime])
```

### 3. Rendering
```javascript
// Render filtered buildings
{filteredBuildings.map(building => (
  <CircleMarker ... />
))}

// Render filtered hotspots
{filteredHotspots.map(hotspot => (
  <CircleMarker className="pulsating-hotspot" ... />
))}
```

## 🎬 Demo Workflow

1. **Start**: Map loads with Monday 12:40-13:30
2. **Change Day**: Select "Friday" → Map updates instantly
3. **Change Time**: Select "8:00-8:50" → Different data shown
4. **Click Building**: Green marker → Popup with details
5. **Click Hotspot**: Red marker → Popup with congestion info
6. **Zoom/Pan**: Explore different campus areas

## 📊 Data Summary

### Building Data
- **Total Records**: ~18,000+
- **Buildings**: 57 unique
- **Days**: Monday-Friday
- **Time Slots**: 9 per day
- **Fields**: Building Name, Day, Time, Proportion, Lat/Long

### Hotspot Data
- **Total Records**: ~900+
- **Clusters**: Multiple congestion zones
- **Days**: Monday-Friday
- **Time Slots**: 9 per day
- **Fields**: Cluster ID, Day, Time, Proportion, Lat/Long

## 🚀 Next Steps

### Basic
- [x] Install and run the app
- [ ] Click around and explore the map
- [ ] Try different days and times
- [ ] Read popup information

### Intermediate
- [ ] Modify colors in `Reveille's RadarMap.jsx`
- [ ] Change pulse speed in `globals.css`
- [ ] Adjust hotspot sizing formula
- [ ] Customize control panel styling

### Advanced
- [ ] Add new animation from `animations.css`
- [ ] Implement marker clustering
- [ ] Add time-series animation
- [ ] Create heatmap layer
- [ ] Export filtered data

## 💡 Pro Tips

1. **Use Browser DevTools**: Inspect elements to see class names
2. **Check Console**: Look for errors or warnings
3. **Hard Refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. **Mobile Testing**: Use browser's device emulator
5. **Performance**: Monitor with React DevTools

## 📖 Documentation Links

- **Main README**: `README.md` - Full project overview
- **Setup Guide**: `SETUP.md` - Detailed installation
- **Component Docs**: `components/README.md` - API reference
- **Animation Library**: `styles/animations.css` - CSS effects

## 🆘 Need Help?

1. Check the console for errors
2. Read `SETUP.md` for detailed troubleshooting
3. Review `components/README.md` for API docs
4. Check React Leaflet docs: https://react-leaflet.js.org/

## 🎉 You're Ready!

You now have a fully functional campus traffic visualization tool. Happy mapping!

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Built with**: React + Next.js + Leaflet

