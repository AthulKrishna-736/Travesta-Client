import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Label } from "../ui/label";

const LocationPicker = ({ onSelect }: { onSelect: (coords: [number, number]) => void }) => {
    useMapEvents({
        click(e: any) {
            onSelect([e.latlng.lat, e.latlng.lng]);
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
                center={geoLocation || [20, 78]}
                zoom={5}
                style={{ height: "250px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <LocationPicker onSelect={setGeoLocation} />
            </MapContainer>

            {geoLocation && (
                <p>
                    Lat: {geoLocation[0]}, Lng: {geoLocation[1]}
                </p>
            )}
        </div>
    );
}

export default GeoMap;