# 🚨 Collision Reporting - Quick Start

## How to Report a Collision in 3 Steps

### Step 1: Click the Report Button
```
┌─────────────────────────┐
│ 🚨 Report Collision     │  ← Click this!
└─────────────────────────┘
```

### Step 2: Click the Map
```
        Map View
┌─────────────────────────┐
│                         │
│     📍 Click here!      │  ← Click where the collision happened
│                         │
└─────────────────────────┘
```

### Step 3: See the Results!
```
        Map View
┌─────────────────────────┐
│                         │
│      ⭕ 🐶             │  ← Orange circle + Miss Rev appears!
│   (pulsating) (shaking)│
└─────────────────────────┘
```

## What You'll See

### Orange Pulsating Circle
- **Color**: Bright orange (#ff6b35)
- **Size**: Small (radius 10)
- **Animation**: Fast pulse (1 second cycle)
- **Location**: Exactly where you clicked

### Miss Rev Icon
- **Image**: Random choice of 2 adorable Miss Rev photos
- **Size**: 40x40 pixels
- **Animation**: Gentle shake/sway (side to side)
- **Location**: Slightly offset from the circle (~11 meters northeast)

## Visual Guide

```
Map Layers (Top to Bottom):
┌────────────────────────────────────┐
│                                    │
│  🟢 Green Dots = Buildings         │
│                                    │
│  🔴 Red Pulsating = Traffic Hotspots │
│                                    │
│  🟠 Orange + 🐶 = Your Collision Reports │
│                                    │
└────────────────────────────────────┘
```

## Button States

### Not Reporting (Default)
```
┌─────────────────────────┐
│ 🚨 Report Collision     │  Orange background
└─────────────────────────┘
```

### Reporting Mode (Active)
```
┌─────────────────────────┐
│ 🚨 Click Map to Report  │  Green background + pulsing glow
└─────────────────────────┘
Click anywhere on the map to place a collision report
```

### After Reporting
```
┌─────────────────────────┐
│ 🚨 Report Collision     │  Back to orange
└─────────────────────────┘
3 collisions reported
```

## Click for Details

### Collision Marker Popup
```
Click the orange circle:
┌────────────────────────────┐
│ 🚨 Collision Report #1     │
│ Location: 30.61340, -96.34│
│ Status: User Reported      │
│ Please use caution in area │
└────────────────────────────┘
```

### Miss Rev Popup
```
Click the Miss Rev icon:
┌────────────────────────────┐
│ 🐶 Miss Rev on Alert!      │
│ Watching over collision    │
│ site #1                    │
└────────────────────────────┘
```

## Legend

Look at the bottom-left legend panel:
```
┌────────────────────────────┐
│ Legend                     │
├────────────────────────────┤
│ 🟢 Individual Buildings    │
│ 🔴 Cluster Hotspots        │
│ 🟠 🚨 User Reported        │
│      Collisions            │
└────────────────────────────┘
```

## Tips & Tricks

### 💡 **Zoom for Accuracy**
Zoom in before reporting for precise placement

### 💡 **Multiple Reports**
You can report multiple collisions - just click the button again!

### 💡 **Different Miss Revs**
Each report gets a random Miss Rev image (50% chance for each)

### 💡 **Auto-Deactivate**
After placing a report, reporting mode automatically turns off

### 💡 **Mobile Friendly**
Works great on touchscreens - just tap the button, then tap the map!

## Animations You'll See

### 1. **Fast Pulse (Collision Circle)**
```
Time:  0s      0.5s      1s
      ⭕  →   ⭕⃝   →   ⭕
     dim    bright    dim
```
- 1-second cycle
- Fades from dim (0.3) to bright (0.8)
- Orange glow expands to 20px radius

### 2. **Shake (Miss Rev Icon)**
```
Time:  0s      0.5s      1s      1.5s      2s
      🐶  →   🐶   →   🐶   →   🐶   →   🐶
    center  left   center  right  center
```
- 2-second cycle
- Moves 3px left, then 3px right
- Slight rotation (-1° to +1°)

### 3. **Button Pulse (When Active)**
```
Time:  0s      0.75s     1.5s
      🟢  →   🟢⃝   →   🟢
    normal   glow    normal
```
- 1.5-second cycle
- Green background
- Pulsating box shadow

## Example Scenario

### Campus Bike Collision Near ACAD Building

1. **Zoom** to the ACAD building area
2. **Click** "Report Collision 🚨" button
3. **Click** the exact spot on the map where the incident occurred
4. **See** the orange pulsating marker appear
5. **See** Miss Rev icon pop up next to it with shake animation
6. **Click** the orange marker to view report details
7. **Share** the report ID with campus safety if needed

## Fun Facts About Miss Rev

🐶 **Miss Rev** is Texas A&M's official mascot!

The two images you'll see:
- **InjuredMissRev.jpg** - Miss Rev with a bandage
- **injuredskatemissrev.jpg** - Miss Rev on a skateboard

Both images are selected randomly (50% chance each) to add variety and personality to your collision reports!

## Keyboard Navigation

- **Tab**: Navigate to the button
- **Enter/Space**: Activate reporting mode
- **Mouse/Touch**: Click/tap the map to place report
- **Tab**: Navigate to placed markers
- **Enter**: Open popup on selected marker

## Mobile Usage

Works perfectly on phones and tablets:

1. **Tap** the "Report Collision 🚨" button
2. **Tap** anywhere on the map
3. **Pinch to zoom** for accuracy
4. **Tap markers** to view details

## That's It! 🎉

You're now ready to help keep the Texas A&M campus safe by reporting collisions with the help of our beloved Miss Rev! 🐶

**Gig 'em!** 👍

---

**Questions?** Check the full documentation: [COLLISION_REPORTING_FEATURE.md](./COLLISION_REPORTING_FEATURE.md)

