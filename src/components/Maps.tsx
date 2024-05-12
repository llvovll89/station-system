import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../styles/theme";

declare global {
    interface Window {
        naver: any;
    }
}

const MapWrap = styled.section`
    & span {
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        padding: 1rem;
        min-width: 120px;
        color: ${theme.color.black};
        background-color: ${theme.color.white};
        z-index: 20;
    }

`

interface MapProps {
    latitude: number;
    longitude: number;
    isCreateWaypoint: boolean;
}

const mapStyle = {
    width: "calc(100vw-66px)",
    height: "100vh",
    margin: "0 0 0 66px",
}

export const NaverMap = ({ latitude, longitude, isCreateWaypoint }: MapProps) => {
    const [wayPoints, setWayPoints] = useState([]);
    const [distance, setDistance] = useState("");

    const { naver } = window;
    const mapElement = useRef(null);

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(latitude, longitude);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        let waypoint = new naver.maps.Polyline({
            map: map,
            path: [],
            strokeColor: '#f00',
            strokeWeight: 5,
            strokeOpacity: 0.8,
        })

        if(isCreateWaypoint) {
            const createWaypoint = (e: React.MouseEvent) => {
                let marker = new naver.maps.Marker({
                    map: map,
                    position: e.coord,
                })

                let path = waypoint.getPath();
                path.push(e.coord);
                setWayPoints(() => ({
                    ...wayPoints,
                    waypoint
                }))
                setDistance(parseFloat(waypoint.getDistance()).toFixed(2));
            } 

            let waypointEvent = naver.maps.Event.addListener(map, "click", createWaypoint);

            return () => {
                naver.maps.Event.removeListener(waypointEvent);
            }
        }

    }, [latitude, longitude, isCreateWaypoint]);


    return (
        <MapWrap>
            {isCreateWaypoint && <span>거리: {distance}m</span>}
            <div id="map" ref={mapElement} style={mapStyle}></div>
        </MapWrap>
    )
}