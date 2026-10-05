import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api/api";
import { FaMap } from 'react-icons/fa';

export default function PoliceHeatmap() {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default center (can be dynamically set to the station's location later)
  const [center, setCenter] = useState([20.5937, 78.9629]); // Default to India center
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    // We can fetch from the public map data for now, 
    // or a specialized police endpoint if one is created later.
    api.get("api/public/map-data/")
      .then(res => {
        if (res.data && res.data.success) {
          setNodes(res.data.nodes);
          // If we have nodes, center on the first one
          if(res.data.nodes.length > 0) {
             setCenter([res.data.nodes[0].lat, res.data.nodes[0].lng]);
             setZoom(10);
          }
        }
      })
      .catch(err => console.error("Map data fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Helper to determine heat color based on priority or type
  const getHeatColor = (priority) => {
    const p = (priority || '').toLowerCase();
    if(p === 'critical' || p === 'high') return '#ef4444'; // Red
    if(p === 'medium') return '#f59e0b'; // Orange
    return '#3b82f6'; // Blue
  };

  return (
    <div className="police-card" style={{ margin: '0 0 24px 0' }}>
        <div className="police-card-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                <FaMap style={{ color: '#ef4444' }} /> Incident Heatmap (Jurisdiction Overview)
            </h3>
        </div>
        <div style={{ height: '400px', width: '100%', marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            {isLoading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b'}}>
                    Loading geographical data...
                </div>
            ) : (
                <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {nodes.map((node, idx) => (
                        <CircleMarker 
                            key={idx}
                            center={[node.lat, node.lng]}
                            pathOptions={{ 
                                color: getHeatColor(node.priority), 
                                fillColor: getHeatColor(node.priority), 
                                fillOpacity: 0.6,
                                weight: 0
                            }}
                            radius={node.priority?.toLowerCase() === 'critical' ? 12 : 8}
                        >
                            <Tooltip>
                                <strong>{node.title}</strong><br/>
                                Priority: {node.priority}<br/>
                                Status: {node.status}<br/>
                                Date: {node.date}
                            </Tooltip>
                        </CircleMarker>
                    ))}
                </MapContainer>
            )}
        </div>
    </div>
  );
}
