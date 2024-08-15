import { useEffect, useRef, useState } from "react";
import { Mission } from "../mission/Mission";
import { ActiveType } from "../../constant/type";
import { useNavigate } from "react-router-dom";
import { MainWrap } from "./MainStyle";
import { Header } from "../../components/Header";
import { Station } from "../station/Station";
import { Schedule } from "../schedule/Schedule";
import { Drone, StationDto } from "../../dto/Station";
import { RUNNING_STATION } from "../../constant/http";
import { DarkMode } from "../../components/Darkmode";
import { MapButton } from "../../components/MapButton";
import DroneImage from "../../assets/image/icon/ico_airplane(w).png";
import api from "../../api/api";
import { MissionDto } from "../../dto/MissionDto";
import { CesiumMap } from "../3dmap/CesiumMap.tsx";

interface RunningMission {
    currentMission: MissionDto;
    drone: Drone;
    status: number;
    latitude: number;
    longitude: number;
    seq: number;
    name: string;
    createAt: string;
}

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none);
    const [map, setMap] = useState<naver.maps.Map | null>(null);
    const [stations, setStations] = useState<StationDto[]>([]);
    const [isActive, setIsActive] = useState("");
    const [isRunningSchedule, setIsRunningSchedule] = useState(false);
    const [runningSchedule, setRunningSchedule] = useState<RunningMission[]>(
        [],
    );

    const dockMarkers = useRef<naver.maps.Marker[]>([]);
    const droneMarkers = useRef<naver.maps.Marker[]>([]);
    const mapElement = useRef(null);

    const waylines = useRef<naver.maps.Polyline | null>(null);
    const markers = useRef<naver.maps.Marker[]>([]);
    const polygon = useRef<naver.maps.Polygon | null>(null);

    const [is3DMapType, setIs3DMapType] = useState<boolean>(false);

    // const getWeaher = async (coords) => {
    //     try {
    //         const response = await api.post()
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(35.8774, 128.6107);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: false,
            mapDataControl: false,
            scaleControl: false,
            mapTypeId: naver.maps.MapTypeId.HYBRID,
            background: "#181818",
            tileTransition: false,
            disableKineticPan: false,
        };

        setMap(new naver.maps.Map(mapElement.current, mapOptions));
        // getWeather()
    }, []);

    const navigate = useNavigate();

    const toggleActive = (type: ActiveType) => {
        setIsActiveType((prev) => (prev === type ? ActiveType.none : type));
    };

    const resetOverlay = () => {
        if (waylines.current) {
            waylines.current.setMap(null);
            waylines.current = null;
        }

        if (polygon.current) {
            polygon.current.setMap(null);
            polygon.current = null;
        }

        markers.current.forEach((marker) => marker.setMap(null));
        markers.current = [];
    };

    const getStation = async () => {
        try {
            const response = await api.get("/station");
            const data = await response.data;

            if (response.status === 200) {
                setStations(data);
                clearMarkers(dockMarkers.current);
                clearMarkers(droneMarkers.current);

                data.forEach(
                    (station: {
                        latitude: number;
                        longitude: number;
                        status: number;
                        drone: {
                            name: string;
                            latitude: number;
                            longitude: number;
                        };
                        name: string;
                    }) => {
                        const params = {
                            latitude: station.latitude,
                            longitude: station.longitude,
                            status: station.status,
                            drone: station.drone,
                            name: station.name,
                        };

                        setDockMarker(params);
                    },
                );

                runningMission();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const runningMission = async () => {
        try {
            const response = await api.get(RUNNING_STATION);
            const data = await response.data;
            console.log("runningMissoin:", data.length);

            if (data.length > 0) {
                resetOverlay();
                setIsRunningSchedule(true);
                setRunningSchedule(data);

                data.forEach(
                    (item: {
                        currentMission: {
                            points: { latitude: number; longitude: number }[];
                            ways: {
                                latitude: number;
                                longitude: number;
                                height: number;
                            }[];
                            type: number;
                        };
                    }) => {
                        if (item.currentMission.type === 1) {
                            polygon.current = new naver.maps.Polygon({
                                map: map ? map : undefined,
                                paths: item.currentMission.points.map(
                                    (point) =>
                                        new naver.maps.LatLng(
                                            point.latitude,
                                            point.longitude,
                                        ),
                                ) as any,
                                strokeColor: "#0080DE",
                                strokeOpacity: 1,
                                strokeWeight: 4,
                                fillColor: "#0080DE",
                                fillOpacity: 0.1,
                                strokeStyle: "solid",
                            });
                        }

                        item.currentMission.points.forEach(
                            (
                                p: { latitude: number; longitude: number },
                                index,
                            ) => {
                                markers.current.push(
                                    new naver.maps.Marker({
                                        map: map ? map : undefined,
                                        position: new naver.maps.LatLng(
                                            p.latitude,
                                            p.longitude,
                                        ),
                                        icon: {
                                            content: `<div class='wayline_marker'>
                                                <span>${index + 1}</span>
                                            </div>`,
                                            anchor: new naver.maps.Point(
                                                12,
                                                12,
                                            ),
                                        },
                                    }),
                                );
                            },
                        );

                        waylines.current = new naver.maps.Polyline({
                            map: map ? map : undefined,
                            path: item.currentMission.ways.map(
                                (way) =>
                                    new naver.maps.LatLng(
                                        way.latitude,
                                        way.longitude,
                                    ),
                            ),
                            strokeColor: "rgb(55, 114, 240)",
                            strokeOpacity: 1,
                            strokeWeight: 4,
                            strokeStyle: "solid",
                        });
                    },
                );
            } else {
                resetOverlay();
                setIsRunningSchedule(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setDockMarker = (params: {
        latitude: number;
        longitude: number;
        status: number;
        drone: {
            name: string;
            latitude: number;
            longitude: number;
        };
    }) => {
        const { latitude, longitude, status } = params;

        if (status === 1) {
            const drone = new naver.maps.Marker({
                map: map ? map : undefined,
                position: new naver.maps.LatLng(
                    params.drone.latitude,
                    params.drone.longitude,
                ),
                icon: {
                    content: `<div class='drone_marker'>
                        <img src=${DroneImage} alt='drone_image' />
                        </div>`,
                    anchor: new naver.maps.Point(16, 16),
                },
                zIndex: 10,
            });

            droneMarkers.current.push(drone);
        }

        const marker = new naver.maps.Marker({
            map: map ? map : undefined,
            position: new naver.maps.LatLng(latitude, longitude),
            icon: {
                content: `<div class='dock_marker'><span>🚍</span></div>`,
                anchor: new naver.maps.Point(18, 18),
            },
        });

        dockMarkers.current.push(marker);
    };

    const clearMarkers = (markers: naver.maps.Marker[]) => {
        markers.forEach((marker) => marker.setMap(null));
        markers.length = 0;
    };

    useEffect(() => {
        !localStorage.getItem("user") && navigate("/");
    }, []);

    useEffect(() => {
        if (!map) return;

        const httpRequestInterval = setInterval(() => {
            getStation();
        }, 2000);
        return () => clearInterval(httpRequestInterval);
    }, [map]);

    return (
        <MainWrap>
            <Header
                isActive={isActive}
                setIsActive={setIsActive}
                toggleMission={() => toggleActive(ActiveType.mission)}
                toggleStation={() => toggleActive(ActiveType.station)}
                toggleSchedule={() => toggleActive(ActiveType.schedule)}
            />

            <div id="map" className="map" ref={mapElement}></div>
            <CesiumMap isVisibleCesiumMap={is3DMapType} stations={stations} />

            {activeType === ActiveType.mission && (
                <Mission
                    isActive={isActive}
                    setIsActive={setIsActive}
                    toggleMission={() => toggleActive(ActiveType.mission)}
                    map={map}
                />
            )}

            {activeType === ActiveType.station && (
                <Station
                    toggleStation={() => toggleActive(ActiveType.station)}
                    setIsActive={setIsActive}
                    map={map}
                />
            )}

            {activeType === ActiveType.schedule && (
                <Schedule
                    isRunningSchedule={isRunningSchedule}
                    setIsActive={setIsActive}
                    stations={stations}
                    toggleSchedule={() => toggleActive(ActiveType.schedule)}
                />
            )}

            {isRunningSchedule && (
                <article className="running_schedule">
                    <h1>스케줄 진행 중...</h1>
                    <div className="running_content">
                        <span>
                            진행 중인 미션 수 : {runningSchedule.length}
                        </span>

                        <article>
                            {runningSchedule.map((item, index) => (
                                <div key={index}>
                                    <span>Station: {item.name}</span>
                                    <span>Drone: {item.drone.name}</span>
                                    <span>
                                        Mission: {item.currentMission.name}
                                    </span>
                                </div>
                            ))}
                        </article>
                    </div>
                </article>
            )}

            <DarkMode />
            <MapButton setIs3DMapType={setIs3DMapType} />
        </MainWrap>
    );
};
