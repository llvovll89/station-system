import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        naver: any;
    }
}

interface MapProps {
    latitude: number;
    longitude: number;
    width: string;
    height: string;
}

export const NaverMap = ({ latitude, longitude, width, height }: MapProps) => {
    const mapRef = useRef<null>(null);
    const [map, setMap] = useState<null>(null);
    const { naver } = window;

    const initMap = () => {
        const mapOptions = {
            zoomControl: true,
            zoomControlOptions: {
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.TOP_RIGHT,
            },
            center: new naver.maps.LatLng(latitude, longitude),
            zoom: 16,
        }

        setMap(new naver.maps.Map('map', mapOptions))
    }

    useEffect(() => {
        initMap();
    }, [mapRef]);

    return <div id="map" ref={mapRef} style={{ width: `${width}`, height: `${height}` }}></div>
}