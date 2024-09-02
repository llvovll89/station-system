import { useRef, useEffect } from "react";
import api from "../../api/api";
import DroneImage from "../../assets/image/icon/ico_airplane(w).png";
import { RUNNING_STATION } from "../../constant/http";
import { debounce } from "../../util/debounce";
import { WeatherDto } from "../../constant/type";

export const NaverMap = (props: any) => {
    const dockMarkers = useRef<naver.maps.Marker[]>([]);
    const droneMarkers = useRef<naver.maps.Marker[]>([]);

    const waylines = useRef<naver.maps.Polyline | null>(null);
    const markers = useRef<naver.maps.Marker[]>([]);
    const polygon = useRef<naver.maps.Polygon | null>(null);

    const clearMarkers = (markers: naver.maps.Marker[]) => {
        markers.forEach((marker) => marker.setMap(null));
        markers.length = 0;
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
                props.setStations(data);
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

            if (data.length > 0) {
                resetOverlay();
                props.setIsRunningSchedule(true);
                props.setRunningSchedule(data);

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
                                map: props.map ? props.map : undefined,
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
                                        map: props.map ? props.map : undefined,
                                        position: new naver.maps.LatLng(
                                            p.latitude,
                                            p.longitude,
                                        ),
                                        icon: {
                                            content: `<div class='wayline_marker'>
                                                ${item.currentMission.type !== 1 ? `<span>${index + 1}</span>` : ""}
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
                            map: props.map ? props.map : undefined,
                            path: item.currentMission.ways.map(
                                (way) =>
                                    new naver.maps.LatLng(
                                        way.latitude,
                                        way.longitude,
                                    ),
                            ),
                            strokeColor: `${item.currentMission.type === 1 ? "#ff005e" : "rgb(55, 114, 240)"}`,
                            strokeOpacity: 1,
                            strokeWeight: 4,
                            strokeStyle: "solid",
                        });
                    },
                );
            } else {
                resetOverlay();
                props.setIsRunningSchedule(false);
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
                map: props.map ? props.map : undefined,
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
            map: props.map ? props.map : undefined,
            position: new naver.maps.LatLng(latitude, longitude),
            icon: {
                content: `<div class='dock_marker'><span>🚍</span></div>`,
                anchor: new naver.maps.Point(18, 18),
            },
            clickable: true,
        });

        naver.maps.Event.addListener(marker, "click", () => {
            const position = new naver.maps.LatLng(latitude, longitude) as any;

            props.map && props.map.panToBounds(new naver.maps.LatLngBounds(position));
        });

        dockMarkers.current.push(marker);
    };

    const getWeather = async () => {
        try {
            const response = await api.get(
                `/weather?latitude=${Number(props.map?.getCenter().y)}&longitude=${Number(props.map?.getCenter().x)}`,
            );
            const data = await response.data;
            console.log("getWeather", data);

            if (response.status === 200) {
                props.setWeaherData((prev: WeatherDto) => ({
                    ...prev,
                    temperature: data.temperature,
                    windSpeed: data.windSpeed,
                    windDirection: data.windDirection,
                    humidity: data.humidity,
                    skyCode: data.skyCode,
                    rainStatus: data.rainStatus,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const debounceUpdateWeather = debounce(getWeather, 1500);

    useEffect(() => {
        if (props.mapElement.current && props.map) {
            const limitKM = 1000;

            let count = 0,
                distancePolyline = null,
                prevPosition: any = null,
                currentPosition: any = null;

            getWeather();
            prevPosition = props.map.getCenter();

            naver.maps.Event.addListener(props.map, "idle", () => {
                count++;

                if (count > 1) {
                    prevPosition = currentPosition;
                }

                currentPosition = props.map.getCenter();

                if (prevPosition && currentPosition) {
                    distancePolyline = new naver.maps.Polyline({
                        map: props.map,
                        path: [
                            new naver.maps.LatLng(
                                prevPosition.lat(),
                                prevPosition.lng(),
                            ),
                            new naver.maps.LatLng(
                                currentPosition.lat(),
                                currentPosition.lng(),
                            ),
                        ],
                        visible: false,
                    });

                    if (Math.ceil(distancePolyline.getDistance()) > limitKM) {
                        console.log("1000m 넘음");
                        debounceUpdateWeather();
                    }
                }
            });
        }
    }, [props.map]);

    useEffect(() => {
        if (!props.map) return;

        const httpRequestInterval = setInterval(() => {
            getStation();
        }, 3000);
        return () => clearInterval(httpRequestInterval);
    }, [props.map]);

    useEffect(() => {
        console.log('네이버맵')
    }, []);

    return (
        <div id="map" className="map" ref={props.mapElement}></div>
    )
}