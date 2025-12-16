# Quick Start Guide

This guide will help you get the Smart Window Control System up and running quickly.

## Prerequisites

- Node.js 18+ installed
- npm installed


### 3. Start the Mobile App

For Android:
```bash
cd mobile
npm install
npx react-native run-android
```

**Important for Physical Devices:** Update the `API_URL` in `mobile/App.tsx` to your computer's IP address instead of `localhost`.

## Usage

### Mobile App Features

1. **View Weather Data**: See real-time pollution, sunlight, wind speed, and temperature
2. **Control Window**: 
   - Toggle Auto Mode on/off
   - Click "Open Window" or "Close Window" buttons (when auto mode is off)
3. **Monitor Status**: See current window state (open/closed) and last update time
4. **Pull down to refresh data manually**
5. **Native mobile UI optimized for touch**


## Understanding Auto Mode

When **Auto Mode is ON**:
- The system automatically controls the window every 30 seconds
- Window opens when conditions are favorable (good air quality, moderate wind, good sunlight)
- Window closes when conditions are poor (high pollution, strong wind)

When **Auto Mode is OFF**:
- You have manual control of the window
- Click "Open Window" or "Close Window" to control it manually

## Troubleshooting

### Mobile app can't connect
- On physical devices, update `API_URL` in `mobile/App.tsx` to your computer's IP
- Make sure your mobile device is on the same network as your computer
- Check firewall settings on your computer

