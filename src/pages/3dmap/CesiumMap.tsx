import { useEffect, useRef, useState } from "react";
import { CesiumMapWrap } from "./CesiumMapStyle.ts";
import { debounce } from "../../util/debounce.ts";
import { WeatherDto } from "../../constant/type.ts";
import api from "../../api/api.ts";
import { MarkableModel } from "./interface/MarkableModel.ts";
import { RUNNING_STATION } from "../../constant/http";

declare const Cesium: any;
export const CesiumMap = (props: any) => {
    const [cesiumViewer, setCesiumViewer] = useState<any>(null);
    const [entities, setEntities] = useState([]);
    const [stationModels, setStationModels] = useState<MarkableModel[]>([]);
    const [droneModels, setDroneModels] = useState<MarkableModel[]>([]);
    const [isCreatedCesiumMap, setIsCreatedCesiumMap] = useState(false);
    const mapElement = useRef(null);

    const DEFAULT_HEIGHT = 100;

    useEffect(() => {
        if (!mapElement.current || isCreatedCesiumMap) {
            return;
        }

        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN_KEY;
        const viewer = new Cesium.Viewer("cesiumContainer", {
            terrain: Cesium.Terrain.fromWorldTerrain(),
        });

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(128.6107, 35.8774, 400),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-15.0),
            },
        });

        (async () => {
            viewer.scene.primitives.add(
                await Cesium.Cesium3DTileset.fromIonAssetId(96188),
            );

            viewer.scene.primitives.add(
                await Cesium.Cesium3DTileset.fromIonAssetId(2275207),
            );
        })();

        const onMoveEnd = () => {
            const cartographic = Cesium.Cartographic.fromCartesian(
                viewer.camera.position,
            );
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);

            debounceUpdateWeather(latitude, longitude);
            props.setCesiumPosition({ latitude, longitude });
        };

        viewer.camera.moveEnd.addEventListener(onMoveEnd);

        setIsCreatedCesiumMap(true);
        setCesiumViewer(viewer);

        return () => {
            viewer.camera.moveEnd.removeEventListener(onMoveEnd);
            viewer.destroy();
            console.log(cesiumViewer);
        };
    }, []);

    useEffect(() => {
        if (!mapElement.current) return;

        const httpRequestInterval = setInterval(() => {
            getStation();
        }, 3000);

        return () => clearInterval(httpRequestInterval);
    }, []);

    const getStation = async () => {
        try {
            const response = await api.get("/station");
            const data = await response.data;

            if (response.status === 200) {
                props.setStations(data);
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
                props.setIsRunningSchedule(true);
                props.setRunningSchedule(data);
            } else {
                props.setIsRunningSchedule(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!cesiumViewer) return;

        for (let i = 0; i < props.stations.length; i++) {
            const foundIndex = stationModels.findIndex(station => station.seq == props.stations[i].seq);
            const dataPoint = {
                longitude: props.stations[i].longitude,
                latitude: props.stations[i].latitude,
                height: DEFAULT_HEIGHT
            };

            if (foundIndex == -1) {
                const pointEntity = cesiumViewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
                    point: { pixelSize: 50, color: Cesium.Color.RED }
                });

                setStationModels(prevState => [...prevState, {
                    seq: props.stations[i].seq,
                    entity: pointEntity
                }]);
            } else {
                const foundDroneIndex = droneModels.findIndex(drone => drone.seq == props.stations[i].drone.seq);

                if (props.stations[i].status == 1) {
                    const dronePoint = {
                        longitude: props.stations[i].drone.longitude,
                        latitude: props.stations[i].drone.latitude,
                        height: props.stations[i].drone.height + DEFAULT_HEIGHT
                    };

                    if (foundDroneIndex == -1) {
                        const modelPath = `${import.meta.env.BASE_URL}model/drone-m30-240517.glb`;
                        const droneEntity = cesiumViewer.entities.add({
                            position: Cesium.Cartesian3.fromDegrees(dronePoint.longitude, dronePoint.latitude, dronePoint.height),
                            model: {
                                uri: modelPath,
                                scale: 50,
                            },
                        });
                        setDroneModels(prevState => [...prevState, {
                            seq: props.stations[i].drone.seq,
                            entity: droneEntity
                        }])
                    } else {
                        (droneModels[foundDroneIndex].entity as any).position = Cesium.Cartesian3.fromDegrees(dronePoint.longitude, dronePoint.latitude, dronePoint.height)
                    }
                } else {
                    if (foundDroneIndex != -1) {
                        cesiumViewer.entities.remove(droneModels[foundDroneIndex].entity);
                        setDroneModels(droneModels.filter(drone => drone.seq != droneModels[foundDroneIndex].seq))
                    }
                }
            }
        }

        if (props.isRunningSchedule && props.runningSchedule.length > 0 && cesiumViewer) {
            entities.forEach(entity => {
                if (cesiumViewer.entities.contains(entity)) {
                    cesiumViewer.entities.remove(entity);
                }
            });
            setEntities([]);

            const newEntities = props.runningSchedule.map((schedule: {
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
                const pointEntities = schedule.currentMission.points.map(point => {
                    return cesiumViewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, 190),
                        point: { pixelSize: 26, color: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLUE, outlineWidth: 2 }
                    });
                });

                const wayLineEntity = cesiumViewer.entities.add({
                    name: "wayline",
                    polylineVolume: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                            schedule.currentMission.ways.flatMap(point => [
                                point.longitude,
                                point.latitude,
                                190, // Height 정보도 포함
                            ])
                        ),
                        width: 10,
                        arcType: Cesium.ArcType.RHUMB,
                        material: Cesium.Color.BLUE,
                        shape: [
                            new Cesium.Cartesian2(-2, -2),
                            new Cesium.Cartesian2(2, -2),
                            new Cesium.Cartesian2(2, 2),
                            new Cesium.Cartesian2(-2, 2),
                        ],
                    }
                });

                if (schedule.currentMission.type === 1) {
                    const degreesArray = schedule.currentMission.points.flatMap(point => [point.longitude, point.latitude]);

                    const polygonEntity = cesiumViewer.entities.add({
                        name: "polygon",
                        polygon: {
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(degreesArray),
                            extrudedHeight: 190,
                            material: Cesium.Color.GREEN,
                            closeTop: true,  // 상단을 닫음
                            closeBottom: true,  // 하단을 닫음
                        },
                    });
                    return [...pointEntities, wayLineEntity, polygonEntity];
                }

                return [...pointEntities, wayLineEntity];
            }).flat();

            setEntities(newEntities);
        } else {
            entities.forEach(entity => {
                if (cesiumViewer.entities.contains(entity)) {
                    cesiumViewer.entities.remove(entity);
                }
            });
            setEntities([]);
        }
    }, [props.stations, props.isRunningSchedule])

    const getWeather = async (lat: any, lng: any) => {
        try {
            const response = await api.get(
                `/weather?latitude=${Number(lat)}&longitude=${Number(lng)}`,
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

    return (
        <CesiumMapWrap>
            <div ref={mapElement} id="cesiumContainer"></div>
        </CesiumMapWrap>
    );
};
