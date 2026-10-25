"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const pin = (symbol, label) =>
  L.divIcon({
    className: "",
    html: `<span role="img" aria-label="${label}" style="font-size:28px;line-height:1;display:block">${symbol}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
  });
const KITCHEN_PIN = pin("🍳", "Kitchen");
const HOME_PIN = pin("🏠", "Delivery address");
const COURIER_PIN = pin("🛵", "Courier");

export default function DeliveryMap({ kitchen, courier, destination }) {
  return (
    <MapContainer
      bounds={[kitchen, destination]}
      boundsOptions={{ padding: [40, 40] }}
      scrollWheelZoom={false}
      style={{ height: "320px" }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      <Polyline positions={[kitchen, destination]} pathOptions={{ dashArray: "6 8", weight: 3 }} />
      <Marker position={kitchen} icon={KITCHEN_PIN}><Popup>Addis Eats kitchen</Popup></Marker>
      <Marker position={destination} icon={HOME_PIN}><Popup>Delivery address</Popup></Marker>
      <Marker position={courier} icon={COURIER_PIN}><Popup>Courier</Popup></Marker>
    </MapContainer>
  );
}