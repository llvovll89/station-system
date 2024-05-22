import { useEffect, useRef, useState } from "react";
import { MapWrap } from "./MapStyles";
import axios from "axios";
import { MISSION } from "../../constant/http";
import { MissionDto } from "../../dto/MissionDto";
import { MissionType } from "../../constant/type";

declare global {
    interface Window {
        naver: any;
    }
}

interface MapProps {
    latitude: number;
    longitude: number;
    isCreateStart?: boolean;
    selectMission?: string | MissionType;
    setIsCreateMission: (value: boolean) => void;
    setIsCreateStart: (value: boolean) => void;
    setSelectMission: (value: string) => void;
    missionData: MissionDto;
    initCreateMission: () => void;
}

export const NaverMap = ({ latitude, longitude, isCreateStart, selectMission, initCreateMission, missionData }: MapProps) => {
    const [map, setMap] = useState(null);
    const [distance, setDistance] = useState<null | string>(null);
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
    const [polylines, setPolylines] = useState<naver.maps.Polyline[]>([]);
    const [paths, setPaths] = useState<naver.maps.LatLng[]>([]);

    const { naver } = window;
    const mapElement = useRef(null);

    const submitPaths = async () => {
        try {
            const newPathArray = paths.map(({ x, y }) => ({
                latitude: y,
                longitude: x
            }));
            const params = {
                name: missionData.name,
                points: newPathArray,
                mainPoint: newPathArray[0],
                angle: missionData.angle
            };

            const response = await axios.post(MISSION, params);
            const data = await response.data;

            console.log(data);
            resetOverlay(); // 성공시에만 적용됨
        } catch (err) {
            console.log(err);
        }
    };

    const resetOverlay = () => {
        console.log(polylines);
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
        const markerItems: naver.maps.Marker[] = [];

        if (type === 'wayline') {
            const polyline = new naver.maps.Polyline({
                map,
                path: [],
                strokeWeight: 4,
                strokeColor: "#09f"
            })

            setPolylines(prevPolylines => [...prevPolylines, polyline])
            const setPolyline = naver.maps.Event.addListener(map, 'click', (e: { coord: naver.maps.LatLng; }) => {
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
                markerItems.push(marker);

                naver.maps.Event.addListener(markerItems[markerItems.length - 1], 'click', () => {
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
            // grid (area) 미션 진행 해야합니다.
            console.log('region');
        }
    };

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(latitude, longitude);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: false,
            mapDataControl: false,
            scaleControl: false,
        };

        setMap(new naver.maps.Map(mapElement.current, mapOptions));
    }, []);

    useEffect(() => {
        if (!map || !isCreateStart) return;

        new naver.maps.Polyline({
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

    return (
        <MapWrap>
            {distance && (
                <div className="overlay_container">
                    {missionData.name && <div className="mission_type">이름: {missionData.name}</div>}
                    <div className="content">
                        <div className="distance">
                            <span>
                                총 거리:
                            </span>
                            <span>
                                {distance}m
                            </span>
                        </div>
                        <div className="markers">
                            <span>
                                웨이포인트:
                            </span>
                            <span>
                                {markers.length}
                            </span>
                        </div>
                    </div>
                    <div className="btn_container">
                        <button onClick={submitPaths}>저장</button>
                    </div>
                </div>
            )}

            <div id="map" className="map" ref={mapElement}></div>
        </MapWrap>
    )
}