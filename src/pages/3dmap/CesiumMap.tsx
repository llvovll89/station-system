import { useEffect, useRef, useState } from "react";
import { CesiumMapWrap } from "./CesiumMapStyle.ts";
// import { debounce } from "../../util/debounce.ts";
import { WeatherDto } from "../../constant/type.ts";
import api from "../../api/api.ts";
import { Weather } from "../main/Weather.tsx";
// import { MarkableModel } from "./interface/MarkableModel.ts";

declare const Cesium: any;
export const CesiumMap = (props: any) => {
    const [cesiumViewer, setCesiumViewer] = useState<any>(null);
    const [cesiumPosition, setCesiumPosition] = useState({
        latitude: 0,
        longitude: 0,
    });
    // const [entities, setEntities] = useState([]);
    // const [stationModels, setStationModels] = useState<MarkableModel[]>([]);
    // const [droneModels, setDroneModels] = useState<MarkableModel[]>([]);
    const mapElement = useRef(null);

    // const DEFAULT_HEIGHT = 100;

    let isCreatedCesiumMap = false;

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

        const onMoveEnd = () => {
            const cartographic = Cesium.Cartographic.fromCartesian(
                viewer.camera.position,
            );
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);

            getWeather(latitude, longitude);
            setCesiumPosition({ latitude, longitude });
            console.log(cesiumViewer);
        };

        viewer.camera.moveEnd.addEventListener(onMoveEnd);

        (async () => {
            viewer.scene.primitives.add(
                await Cesium.Cesium3DTileset.fromIonAssetId(96188),
            );

            viewer.scene.primitives.add(
                await Cesium.Cesium3DTileset.fromIonAssetId(2275207),
            );
        })();

        isCreatedCesiumMap = true;
        setCesiumViewer(viewer);

        return () => {
            viewer.camera.moveEnd.removeEventListener(onMoveEnd);
            viewer.destroy();
        };
    }, [mapElement]);

    // useEffect(() => {
    //     for (let i = 0; i < props.stations.length; i++) {
    //         const foundIndex = stationModels.findIndex(station => station.seq == props.stations[i].seq);
    //         const dataPoint = {
    //             longitude: props.stations[i].longitude,
    //             latitude: props.stations[i].latitude,
    //             height: DEFAULT_HEIGHT
    //         };

    //         if (foundIndex == -1) {
    //             const pointEntity = cesiumViewer.entities.add({
    //                 position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height - 10),
    //                 point: { pixelSize: 42, color: Cesium.Color.RED, outlineColor: Cesium.Color.BLACK, outlineWidth: 2 }
    //             });

    //             setStationModels(prevState => [...prevState, {
    //                 seq: props.stations[i].seq,
    //                 entity: pointEntity
    //             }]);
    //         } else {
    //             const foundDroneIndex = droneModels.findIndex(drone => drone.seq == props.stations[i].drone.seq);

    //             if (props.stations[i].status == 1) {
    //                 const dronePoint = {
    //                     longitude: props.stations[i].drone.longitude,
    //                     latitude: props.stations[i].drone.latitude,
    //                     height: props.stations[i].drone.height + DEFAULT_HEIGHT
    //                 };

    //                 if (foundDroneIndex == -1) {
    //                     const modelPath = `${import.meta.env.BASE_URL}model/drone-m30-240517.glb`;
    //                     const droneEntity = cesiumViewer.entities.add({
    //                         position: Cesium.Cartesian3.fromDegrees(dronePoint.longitude, dronePoint.latitude, dronePoint.height),
    //                         model: {
    //                             uri: modelPath,
    //                             scale: 50,
    //                         },
    //                     });
    //                     setDroneModels(prevState => [...prevState, {
    //                         seq: props.stations[i].drone.seq,
    //                         entity: droneEntity
    //                     }])
    //                 } else {
    //                     (droneModels[foundDroneIndex].entity as any).position = Cesium.Cartesian3.fromDegrees(dronePoint.longitude, dronePoint.latitude, dronePoint.height)
    //                 }
    //             } else {
    //                 if (foundDroneIndex != -1) {
    //                     cesiumViewer.entities.remove(droneModels[foundDroneIndex].entity);
    //                     setDroneModels(droneModels.filter(drone => drone.seq != droneModels[foundDroneIndex].seq))
    //                 }
    //             }
    //         }
    //     }

    //     if (props.runningSchedule.length > 0 && cesiumViewer) {
    //         // 기존 엔티티 제거
    //         entities.forEach(entity => cesiumViewer.entities.remove(entity));
    //         setEntities([]); // 상태 초기화

    //         // 새로운 엔티티 추가
    //         const newEntities = props.runningSchedule.map((schedule: {
    //             currentMission: {
    //                 points: { latitude: number; longitude: number }[];
    //                 ways: {
    //                     latitude: number;
    //                     longitude: number;
    //                     height: number;
    //                 }[];
    //                 type: number;
    //             };
    //         }) => {
    //             if (schedule.currentMission.type === 1) {
    //                 console.log('polygon');
    //             } else {
    //                 console.log('waypoint');
    //             }

    //             const pointEntities = schedule.currentMission.points.map(point => {
    //                 return cesiumViewer.entities.add({
    //                     position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, 190),
    //                     point: { pixelSize: 26, color: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, outlineWidth: 2 }
    //                 });
    //             });

    //             const wayLineEntity = cesiumViewer.entities.add({
    //                 polyline: {
    //                     positions: Cesium.Cartesian3.fromDegreesArrayHeights(
    //                         schedule.currentMission.ways.flatMap(point => [
    //                             point.longitude,
    //                             point.latitude,
    //                             190, // Height 정보도 포함
    //                         ])
    //                     ),
    //                     width: 10,
    //                     arcType: Cesium.ArcType.RHUMB,
    //                     material: Cesium.Color.BLUE,
    //                 },
    //             });

    //             return [...pointEntities, wayLineEntity];
    //         }).flat();

    //         // 새로 추가된 엔티티 상태에 저장
    //         setEntities(newEntities);

    //     } else {
    //         // 엔티티가 없을 경우, 상태에 저장된 엔티티들 제거
    //         entities.forEach(entity => cesiumViewer.entities.remove(entity));
    //         setEntities([]); // 상태 초기화
    //     }
    // }, [props.stations])

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

    // const debounceUpdateWeather = debounce(getWeather, 1500);

    return (
        <CesiumMapWrap>
            <div ref={mapElement} id="cesiumContainer"></div>

            {cesiumPosition && mapElement && (
                <Weather
                    coords={{
                        latitude: cesiumPosition.latitude,
                        longitude: cesiumPosition.longitude,
                    }}
                    weatherData={props.weatherData}
                />
            )}
        </CesiumMapWrap>
    );
};
