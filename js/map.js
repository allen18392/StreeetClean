/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Leaflet Map Engine
 * Manages festival hotspot markers, GPS pins, custom Gold/Emerald popups, and zone navigation.
 */

class MapEngine {
  constructor() {
    this.maps = {};
    this.markers = {};
    this.userMarker = null;
    // Center on Legazpi City / Peñaranda Park area
    this.defaultCenter = [13.1398, 123.7410];
    this.defaultZoom = 14;
  }

  // Create custom SVG badges for Leaflet pins
  createCustomIcon(status = 'open', bounty = 'TBA') {
    let bgColor = '#f59e0b';
    let textColor = '#ffffff';
    let iconClass = 'fa-fire-flame-curved';

    if (status === 'in_progress' || status === 'claimed') {
      bgColor = '#0284c7';
      iconClass = 'fa-broom';
    } else if (status === 'in_review') {
      bgColor = '#d97706';
      iconClass = 'fa-magnifying-glass';
    } else if (status === 'completed' || status === 'verified') {
      bgColor = '#059669';
      iconClass = 'fa-circle-check';
    }

    return L.divIcon({
      className: 'custom-leaflet-marker-wrap',
      html: `
        <div class="custom-map-pin" style="
          background: ${bgColor};
          color: ${textColor};
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        ">
          <i class="fa-solid ${iconClass}" style="font-size: 10px;"></i>
          <span>${bounty}</span>
        </div>
      `,
      iconSize: [85, 32],
      iconAnchor: [42, 16]
    });
  }

  // Initialize commissions interactive map
  initCommissionsMap(containerId, commissions, onMarkerClick) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // Remove prior map instance if exists
    if (this.maps[containerId]) {
      try {
        this.maps[containerId].remove();
      } catch (e) {
        console.warn('Map cleanup:', e);
      }
      delete this.maps[containerId];
    }

    const map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView(this.defaultCenter, this.defaultZoom);

    // High-contrast clean CartoDB Voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    this.maps[containerId] = map;
    this.markers[containerId] = [];

    // Add all hotspot markers
    commissions.forEach(comm => {
      if (comm.lat && comm.lng) {
        const marker = L.marker([comm.lat, comm.lng], {
          icon: this.createCustomIcon(comm.status, window.appState.getRewardDisplay(comm))
        }).addTo(map);

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; padding: 4px; min-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: #f0fdf4; color: #047857; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">${comm.category}</span>
              <span style="font-weight: 800; color: #b45309; font-family: monospace; font-size: 13px;">${window.appState.getRewardDisplay(comm)}</span>
            </div>
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px; color: #0f172a; line-height: 1.3;">${comm.title}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;"><i class="fa-solid fa-location-dot" style="color: #059669;"></i> ${comm.sector}</div>
            <button onclick="window.openTaskModal('${comm.id}')" style="width: 100%; background: linear-gradient(135deg, #059669, #10b981); color: #fff; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> View Task Details
            </button>
          </div>
        `;
        marker.bindPopup(popupContent, { offset: [0, -10] });
        this.markers[containerId].push(marker);
      }
    });

    // Invalidate map size multiple times to prevent gray tile rendering bugs
    setTimeout(() => { map.invalidateSize(); }, 150);
    setTimeout(() => { map.invalidateSize(); }, 450);
    return map;
  }

  // Pan to a specific Legazpi zone
  panToZone(containerId, lat, lng, zoom = 15) {
    const map = this.maps[containerId];
    if (map) {
      map.flyTo([lat, lng], zoom, {
        animate: true,
        duration: 1.2
      });
    }
  }

  // Locate user with GPS beacon
  locateUser(containerId) {
    const map = this.maps[containerId];
    if (!map) return;

    // Simulate GPS pinpoint at Peñaranda Park / Capitol
    const userLat = 13.1398;
    const userLng = 123.7380;

    if (this.userMarker) {
      this.userMarker.remove();
    }

    const userIcon = L.divIcon({
      className: 'user-gps-marker',
      html: `
        <div style="width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(2,132,199,0.8); animation: pulse 1.5s infinite;"></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    this.userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
    this.userMarker.bindPopup('<b>Your Current GPS Location</b><br>Old Albay District, Legazpi City').openPopup();

    map.flyTo([userLat, userLng], 15, { animate: true, duration: 1 });
  }

  // Location picker map for creating new reports
  initReportLocationPicker(containerId, onLocationChange) {
    return this.initPickerMap(containerId, this.defaultCenter[0], this.defaultCenter[1], onLocationChange);
  }

  initPickerMap(containerId, initialLat, initialLng, onLocationChange) {
    if (!document.getElementById(containerId)) return null;

    if (this.maps[containerId]) {
      try {
        this.maps[containerId].remove();
      } catch (e) {}
      delete this.maps[containerId];
    }

    const lat = initialLat || this.defaultCenter[0];
    const lng = initialLng || this.defaultCenter[1];

    const map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'picker-pin-icon',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(135deg, #059669, #10b981);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          border: 3px solid #ffffff;
        ">
          <i class="fa-solid fa-camera" style="transform: rotate(45deg); color: #ffffff; font-size: 14px;"></i>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38]
    });

    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: pinIcon
    }).addTo(map);

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      if (onLocationChange) onLocationChange(pos.lat, pos.lng);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      if (onLocationChange) onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    this.maps[containerId] = map;
    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 400);
    return map;
  }

  destroy() {
    Object.keys(this.maps).forEach(id => {
      try {
        if (this.maps[id]) this.maps[id].remove();
      } catch (e) {}
    });
    this.maps = {};
    this.markers = {};
  }
}

// Support both naming conventions
window.MapEngine = new MapEngine();
window.mapEngine = window.MapEngine;
