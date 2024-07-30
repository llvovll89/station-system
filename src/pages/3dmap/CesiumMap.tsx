import {useEffect, useRef, useState} from "react";
import {CesiumMapWrap} from "./CesiumMapStyle.ts";

declare const Cesium: any;
export const CesiumMap = (props: any) => {
    const [cesiumViewer, setCesiumViewer] = useState<any>(null);
    const mapElement = useRef(null)
    const [stations, setStations] = useState<any[]>([]);
    let isCreatedCesiumMap = false;

    useEffect(() => {
        if (!mapElement.current || isCreatedCesiumMap) {
            return
        }

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYjFmOWQ0YS1lY2I1LTQyOTAtOGRhYy04YWFjODM3YzJjZGMiLCJpZCI6MjMxNDQ4LCJpYXQiOjE3MjIyNjk3MTB9.BflDjz6jkdLIBJobHcgkxn1aBTZ-HU0kTqVKGAMboD4';

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

        isCreatedCesiumMap = true;
        setCesiumViewer(viewer);
    }, [mapElement]);

    useEffect(() => {
        for (let i = 0; i < props.stations.length; i++) {
            const foundIndex = stations.findIndex(station => station.data.seq == props.stations[i].seq);

            if (foundIndex == -1) {
                setStations(prevState => [...prevState, {
                    data: props.stations[i],
                    entity: null,
                    droneEntity: null
                }]);
            } else {
                const newStations = [...stations];

                newStations.splice(foundIndex, 1, {
                    data: props.stations[i],
                    entity: stations[foundIndex].entity,
                    droneEntity: stations[foundIndex].droneEntity
                })

                setStations(newStations)
            }
        }
    }, [props.stations])

    useEffect(() => {
        if (cesiumViewer) {
            for (let i = 0; i < stations.length; i++) {
                if (stations[i].entity == null) {
                    const dataPoint = {
                        longitude: stations[i].data.longitude,
                        latitude: stations[i].data.latitude,
                        height: 100
                    };

                    const pointEntity = cesiumViewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
                        point: {pixelSize: 40, color: Cesium.Color.RED}
                    });

                    stations[i].entity = pointEntity
                    setStations(stations);
                }


                if (stations[i].droneEntity == null) {
                    if (stations[i].data.status == 1) {
                        const dataPoint = {
                            longitude: stations[i].data.drone.longitude,
                            latitude: stations[i].data.drone.latitude,
                            height: 130
                        };

                        const droneEntity = cesiumViewer.entities.add({
                            position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
                            point: {pixelSize: 30, color: Cesium.Color.BLUE_BITS}
                        });

                        stations[i].droneEntity = droneEntity;
                        setStations(stations);
                    }
                } else {
                    if (stations[i].data.status == 1) {
                        const dataPoint = {
                            longitude: stations[i].data.drone.longitude,
                            latitude: stations[i].data.drone.latitude,
                            height: 130
                        };
                        stations[i].droneEntity.position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height)
                        setStations(stations);
                    } else {
                        cesiumViewer.entities.remove(stations[i].droneEntity);
                        stations[i].droneEntity = null;
                        setStations(stations);
                    }
                }
            }
        }
    }, [stations])

    return (
        <CesiumMapWrap>
            <div className={`cesiumMapWrap ${props.isVisibleCesiumMap && "visible"}`}>
                <div ref={mapElement} id="cesiumContainer"></div>
            </div>
        </CesiumMapWrap>
    )
}
