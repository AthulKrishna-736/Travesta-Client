import React, { useEffect, useRef } from "react";
import { OlaMaps } from "olamaps-web-sdk";
import { env } from "@/config/config";

const MyOlaMap: React.FC<{ lat?: number; long?: number }> = ({ lat, long }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ola = new OlaMaps({ apiKey: env.OLA_API_SECRET });
        const center = [long ?? 78.6569, lat ?? 22.9734];

        const map = ola.init({
            container: ref.current,
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            center,
            zoom: 15,
            language: "en",
            interactive: false,
        });

        map.on("load", () => ola.addMarker({ anchor: "bottom", color: 'red' }).setLngLat(center).addTo(map));

        return () => map.remove?.();
    }, [lat, long]);

    return <div className="shadow-md" ref={ref} style={{ width: "100%", height: "500px" }} />;
};

export default MyOlaMap;
