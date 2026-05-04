import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const indiaCenter = [22.5937, 78.9629];

// Mock data for regions
const regionData = [
  { id: 1, name: 'Delhi', coords: [28.6139, 77.2090], riskScore: 82, cases: 1450 },
  { id: 2, name: 'Mumbai', coords: [19.0760, 72.8777], riskScore: 88, cases: 2100 },
  { id: 3, name: 'Bangalore', coords: [12.9716, 77.5946], riskScore: 45, cases: 420 },
  { id: 4, name: 'Kolkata', coords: [22.5726, 88.3639], riskScore: 65, cases: 890 },
  { id: 5, name: 'Chennai', coords: [13.0827, 80.2707], riskScore: 55, cases: 670 },
  { id: 6, name: 'Hyderabad', coords: [17.3850, 78.4867], riskScore: 35, cases: 310 },
  { id: 7, name: 'Pune', coords: [18.5204, 73.8567], riskScore: 78, cases: 1100 },
  { id: 8, name: 'Ahmedabad', coords: [23.0225, 72.5714], riskScore: 52, cases: 540 },
];

const getRiskColor = (score) => {
  if (score > 80) return '#ef4444'; // Danger
  if (score > 60) return '#f59e0b'; // Warning
  return '#3b82f6'; // Blue
};

const MapPage = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Geospatial ILI Surveillance</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Interactive choropleth and risk distribution map of India.</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>High Risk</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score &gt; 80 (Urgent Action)</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Moderate Risk</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score 60 - 80 (Monitor)</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Low Risk</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score &lt; 60 (Normal)</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button className="btn btn-secondary" style={{ width: '100%' }}>Export Map Data</button>
        </div>
      </div>

      <div className="glass-panel map-container" style={{ height: '600px', padding: 0 }}>
        <MapContainer 
          center={indiaCenter} 
          zoom={5} 
          style={{ height: '100%', width: '100%', background: '#0f172a' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {regionData.map(region => (
            <CircleMarker
              key={region.id}
              center={region.coords}
              radius={region.riskScore / 3}
              pathOptions={{
                color: getRiskColor(region.riskScore),
                fillColor: getRiskColor(region.riskScore),
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup className="custom-popup">
                <div style={{ padding: '4px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>{region.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Risk Score:</span>
                      <strong style={{ color: getRiskColor(region.riskScore) }}>{region.riskScore}/100</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Active Cases:</span>
                      <strong>{region.cases.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Status:</span>
                      <strong>{region.riskScore > 80 ? 'High Alert' : region.riskScore > 60 ? 'Warning' : 'Stable'}</strong>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
