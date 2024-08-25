import { useEffect, useRef, useState } from "react";
import { CesiumMapWrap } from "./CesiumMapStyle.ts";
import { MarkableModel } from "./interface/MarkableModel.ts";

declare const Cesium: any;
export const CesiumMap = (props: any) => {
    const [cesiumViewer, setCesiumViewer] = useState<any>(null);
    const [stationModels, setStationModels] = useState<MarkableModel[]>([]);
    const [droneModels, setDroneModels] = useState<MarkableModel[]>([]);
    const mapElement = useRef(null)
    const DEFAULT_HEIGHT = 100;

    let isCreatedCesiumMap = false;

    useEffect(() => {
        if (!mapElement.current || isCreatedCesiumMap) {
            return
        }

        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN_KEY;

        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrain: Cesium.Terrain.fromWorldTerrain(),
        });

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(128.6107, 35.8774, 400),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-15.0),
            }
        });

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
    }, [mapElement]);

    useEffect(() => {
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
                    point: { pixelSize: 50, color: Cesium.Color.RED, outlineColor: Cesium.Color.BLACK, outlineWidth: 2}
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
    }, [props.stations])

    useEffect(() => {
        if(props.runningSchedule) {
            // const wayLine = cesiumViewer.entities.add({
            //     polyline: {
            //         positions: Cesium.Cartesian3.fromDegreesArray(
            //             props.runningSchedule.map(
            //                 (schedule: any) => [schedule.startLongitude, schedule.startLatitude, DEFAULT_HEIGHT]
            //             )
            //         ),
            //         width: 5,
            //         arcType: Cesium.ArcType.RHUMB,
            //         material: Cesium.Color.YELLOW,
            //     },
            // })
    
            console.log('running_mission:', props.runningSchedule);
            // console.log('wayline:', wayLine);
        }

    }, [props.runningSchedule]);

    return (
        <CesiumMapWrap>
            <div className={`cesiumMapWrap ${props.isVisibleCesiumMap && "visible"}`}>
                <div ref={mapElement} id="cesiumContainer"></div>
            </div>
        </CesiumMapWrap>
    )
}
