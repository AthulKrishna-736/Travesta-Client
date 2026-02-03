import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Label } from "../ui/label";

const LocationPicker = ({ onSelect }: { onSelect: (coords: [number, number]) => void }) => {
    useMapEvents({
        click(e: { latlng: { lng: number, lat: number } }) {
            onSelect([e.latlng.lng, e.latlng.lat]);
        },
    });
    return null;
};

interface GeoMapProps {
    geoLocation?: [number, number],
    setGeoLocation: (data: [number, number]) => void;
}

const GeoMap: React.FC<GeoMapProps> = ({ geoLocation, setGeoLocation }) => {

    return (
        <div>
            <Label className="mb-3">Select Location (Click on map)</Label>
            <MapContainer
                center={geoLocation ? { lat: geoLocation[1], lng: geoLocation[0] } : { lat: 20, lng: 78 }}
                zoom={geoLocation ? 13 : 5}
                style={{ height: "300px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <LocationPicker onSelect={setGeoLocation} />
            </MapContainer>

            {geoLocation && (
                <p>
                    Lat: {geoLocation[1]}, Lng: {geoLocation[0]}
                </p>
            )}
        </div>
    );
}

export default GeoMap;