import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../styles/theme";

declare global {
    interface Window {
        naver: any;
    }
}

const MapWrap = styled.section`
    & .distance {
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

    & .marker {
        background-color: ${theme.color.black};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: ${theme.color.white};
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #09f;
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
        let markers = [];

        if(isCreateWaypoint) {
            let index = 0;

            const createWaypoint = (e: React.MouseEvent) => {
                index += 1;

                let marker = new naver.maps.Marker({
                    map: map,
                    position: e.coord,
                    icon: {
                        content: `<div class='marker'>${index}</div>`,
                        anchor: new naver.maps.Point(12, 12),
                    }
                })

                markers.push(marker);

                let path = waypoint.getPath();
                path.push(e.coord);

                setWayPoints(() => ({
                    ...wayPoints,
                    waypoint
                }))

                setDistance(parseFloat(waypoint.getDistance()).toFixed(2));
                naver.maps.Event.addListener(markers[markers.length - 1], "click", (e) => {
                    naver.maps.Event.removeListener(waypointEvent);
                })
            } 

            let waypointEvent = naver.maps.Event.addListener(map, "click", createWaypoint);

            return () => {
                naver.maps.Event.removeListener(waypointEvent);
            }
        }

    }, [latitude, longitude, isCreateWaypoint]);


    return (
        <MapWrap>
            {isCreateWaypoint && <div className="distance">거리: {distance}m</div>}
            <div id="map" ref={mapElement} style={mapStyle}></div>
        </MapWrap>
    )
}