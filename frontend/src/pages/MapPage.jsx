import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import { useState, useEffect } from 'react';
import api from '../api/axios';

const indiaCenter = [22.5937, 78.9629];

const getRiskColor = (score) => {
  if (score > 80) return '#ef4444'; // Danger
  if (score > 60) return '#f59e0b'; // Warning
  return '#3b82f6'; // Blue
};

const MapPage = () => {
  const [regionData, setRegionData] = useState([]);
  const [disabledMessage, setDisabledMessage] = useState(null);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await api.get('/regional-map');
        setRegionData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setDisabledMessage(err.response.data.error);
        } else {
          console.error("Error fetching map data", err);
        }
      }
    };
    fetchMap();
  }, []);

  if (disabledMessage) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ display: 'inline-block', padding: '48px', maxWidth: '600px' }}>
          <Activity size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ marginBottom: '16px' }}>Module Disabled</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{disabledMessage}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            The most recently uploaded dataset does not contain geographical columns (state, district, region_code, etc.). 
            Please upload a Geographic Dataset to enable this view.
          </p>
        </div>
      </div>
    );
  }
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
          
          {regionData.map((region, idx) => (
            <CircleMarker
              key={region.state || idx}
              center={[region.latitude, region.longitude]}
              radius={Math.max(region.riskScore / 3, 5)}
              pathOptions={{
                color: getRiskColor(region.riskScore),
                fillColor: getRiskColor(region.riskScore),
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup className="custom-popup">
                <div style={{ padding: '4px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>{region.state}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Risk Score:</span>
                      <strong style={{ color: getRiskColor(region.riskScore) }}>{region.riskScore}/100</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Predicted Cases:</span>
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
