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
    margin?: string;
}

export const NaverMap = ({ latitude, longitude, width, height, margin }: MapProps) => {
    const { naver } = window;
    const mapElement = useRef(null);

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
        const location = new naver.maps.LatLng(37.5656, 126.9769);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        new naver.maps.Marker({
            position: location,
            map,
        });

    }, []);


    return <div id="map" ref={mapElement} style={{ width: `${width}`, height: `${height}`, margin: `${margin}` }}></div>
}