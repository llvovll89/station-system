import { MutableRefObject, useEffect, useRef } from "react";

const mapStyle = {
    width: '100vw',
    height: '100vh'
};

interface MapProps {
    latitude: number;
    longitude: number;
}

const loadScript = (src: string, callback: () => void) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = () => callback();
    document.head.appendChild(script);
}

export const NaverMap = ({ latitude, longitude }: MapProps) => {
    const mapRef = useRef<HTMLElement | null>(null);

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
    }

    useEffect(() => {
    }, [mapRef]);

    return <div id="map" style={mapStyle}></div>
}