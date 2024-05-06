import { MutableRefObject, useEffect, useRef } from "react";
import styled from "styled-components";

declare global {
    interface Window {
        kakao: any;
    }
}

const mapStyle = {
    width: '100vw',
    height: '100vh'
};

export const KaKaoMap = () => {
    const mapRef = useRef<HTMLElement | null>(null);

    const initMap = () => {
        const container = document.getElementById("map");
        const options = {
            center: new window.kakao.maps.LatLng(37.483034, 126.902435),
            level: 2,
        };

        const map = new window.kakao.maps.Map(container as HTMLElement, options);
        (mapRef as MutableRefObject<any>).current = map;
    };

    useEffect(() => {
        window.kakao.maps.load(() => initMap());
    }, [mapRef]);

    return <div id="map" style={mapStyle}></div>
}