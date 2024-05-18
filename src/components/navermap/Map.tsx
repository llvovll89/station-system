import { useEffect, useRef, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { MapWrap } from "./MapStyles";

declare global {
    interface Window {
        naver: any;
    }
}

interface MapProps {
    latitude: number;
    longitude: number;
    isCreateStart?: boolean;
    selectMission?: string;
    setIsCreateMission: (value: boolean) => void;
    setIsCreateStart: (value: boolean) => void;
    setSelectMission: (value: string) => void;
}

export const NaverMap = ({ latitude, longitude, isCreateStart, selectMission, setIsCreateMission, setIsCreateStart, setSelectMission }: MapProps) => {
    const [map, setMap] = useState(null);
    const [distance, setDistance] = useState<null | string>(null);
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
    const [polylines, setPolylines] = useState<naver.maps.Polyline[]>([]);
    const [paths, setPaths] = useState<naver.maps.LatLng[]>([]);

    const { naver } = window;
    const mapElement = useRef(null);

    const initCreateMission = () => {
        setIsCreateMission(false);
        setIsCreateStart(false);
        setSelectMission("");
        // wayline , marker 초기화
    };

    const submitPaths = () => {
        // 미션 생성 호출
        resetOverlay();
    };

    const resetOverlay = () => {
        setMarkers((m) => {
            return m.map((marker) => {
                marker.setMap(null);
                return marker;
            });
        });
        setPolylines((p) => {
            return p.map((polyline) => {
                polyline.setMap(null);
                return polyline;
            });
        });
        setPaths([]);
        setDistance(null);
        setMarkers([]);
        setPolylines([]);
    };

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(latitude, longitude);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        setMap(new naver.maps.Map(mapElement.current, mapOptions));
    }, []);

    useEffect(() => {
        if (!map || !isCreateStart) return;

        const waypoint = new naver.maps.Polyline({
            map: map,
            path: [],
            strokeColor: '#f00',
            strokeWeight: 5,
            strokeOpacity: 0.8,
        });
    }, []);

    useEffect(() => {
        createMission();
    }, [isCreateStart, selectMission]);

    const createMission = () => {
        if (isCreateStart) {
            if (selectMission === 'wayline') {
                createOverLayEvent(selectMission)
            } else if (selectMission === 'region') {
                createOverLayEvent(selectMission);
            }
        }
    };

    const createOverLayEvent = (type: string) => {
        const markerItems = [];

        if (type === 'wayline') {
            const polyline = new naver.maps.Polyline({
                map,
                path: [],
                strokeWeight: 4,
                strokeColor: "#09f"
            })

            setPolylines(prevPolylines => [...prevPolylines, polyline])

            const setPolyline = naver.maps.Event.addListener(map, 'click', (e: React.MouseEvent) => {
                const path = polyline.getPath();
                path.push(e.coord);
                setPaths(prevPaths => [...prevPaths, e.coord]);

                const marker = new naver.maps.Marker({
                    map,
                    position: e.coord,
                    icon: {
                        content: `<div class='wayline_marker'>${markerItems.length + 1}</div>`,
                        anchor: new naver.maps.Point(12, 12),
                    }
                });

                setMarkers(prevMarkers => [...prevMarkers, marker]);
                markerItems.push(marker)

                const lastPointMarker = naver.maps.Event.addListener(markerItems.at(-1), 'click', (e) => {
                    if (path.length > 1) {
                        naver.maps.Event.removeListener(setPolyline);
                        setDistance(parseFloat(polyline.getDistance()).toFixed(2));
                        initCreateMission();
                    } else {
                        alert("경로가 2개 이상일 때만 가능합니다!")
                    }
                })
            })
        } else {
            const setPolygon = naver.maps.Event.addListener(map, 'click', (e: React.MouseEvent) => {
                console.log(e);
            })
        }
    };

    return (
        <MapWrap>
            {distance && (
                <div className="overlay_container">
                    <div className="distance">총거리: {distance}m</div>
                    <div className="markers">마커 갯수: {markers.length}</div>
                    <div className="btn_container">
                        <button onClick={submitPaths}>저장</button>
                        {/* <button onClick={resetOverlay}>초기화</button> */}
                    </div>
                </div>
            )}

            <div id="map" className="map" ref={mapElement}></div>
            <div onClick={initCreateMission} className="init_mission">
                <AiOutlineReload />
            </div>
        </MapWrap>
    )
}