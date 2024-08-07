// import { useEffect, useRef, useState } from "react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/button/Button";
import { MISSION } from "../../../constant/http";
import { MissionDto } from "../../../dto/MissionDto";
import api from "../../../api/api";

interface WaypPointMissionProps {
    map: naver.maps.Map | null;
    setIsRunningMission: React.Dispatch<
        React.SetStateAction<{
            waypoint: boolean;
            grid: boolean;
            isStart: boolean;
        }>
    >;
    isRunningMission: {
        waypoint: boolean;
        grid: boolean;
        isStart: boolean;
    };
    missionData: MissionDto;
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>;
    setIsCreateMission: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>;
    initMissionData: () => void;
}

export const WaypPointMission = ({
    map,
    missionData,
    isRunningMission,
    setIsRunningMission,
    setIsHttpRequest,
    setMissionData,
    initMissionData,
}: WaypPointMissionProps) => {
    const [wayLines, setWayLines] = useState<naver.maps.LatLng[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [distance, setDistance] = useState(0);

    let pointsMarkers: naver.maps.Marker[] = [];
    let polyLine: naver.maps.Polyline | null = null;
    let guideLine: naver.maps.Polyline | null = null;
    let mainPoint: naver.maps.LatLng[] = [];

    // const pointMarkers = useRef<naver.maps.Marker[]>([]);
    // const polylineRef = useRef<naver.maps.Polyline | null>(null);
    // const guideLineRef = useRef<naver.maps.Polyline | null>(null);
    // const mainPointsRef = useRef<naver.maps.LatLng[]>([]);

    const resetData = () => {
        if (isRunning) {
            alert("마지막 포인트 클릭 후 다시 초기화 해주세요!");
            return;
        }

        if (pointsMarkers.length > 0) {
            pointsMarkers.forEach((m) => m.setMap(null));
            pointsMarkers = [];
        }

        if (polyLine) {
            polyLine.setMap(null);
            polyLine = null;
        }

        if (guideLine) {
            guideLine.setMap(null);
            guideLine = null;
        }

        if (mainPoint.length > 0) mainPoint = [];

        // // 모든 마커 제거
        // pointMarkers.current.forEach((marker) => marker.setMap(null));
        // pointMarkers.current = [];

        // // 모든 포인트 초기화
        // mainPointsRef.current = [];

        // // 폴리라인 제거
        // if (polylineRef.current) {
        //     polylineRef.current.setMap(null);
        //     polylineRef.current = null;
        // }

        // // 가이드라인 제거
        // if (guideLineRef.current) {
        //     guideLineRef.current.setMap(null);
        //     guideLineRef.current = null;
        // }

        setWayLines([]);
        setDistance(0);
        setIsRunning(false);
        initMissionData();
    };

    const initWaypoint = () => {
        resetData();
        createWayPointMission();
    };

    const createWayPointMission = () => {
        if (isRunningMission.waypoint) {
            setMissionData({
                ...missionData,
                type: 0,
            });
            setIsRunning(true);
            const waypoints: naver.maps.LatLng[] = [];

            const setWayPoint = naver.maps.Event.addListener(
                map,
                "click",
                (e: { coord: naver.maps.LatLng }) => {
                    waypoints.push(e.coord);

                    // if (!polylineRef.current) {
                    //     polylineRef.current = new naver.maps.Polyline({
                    //         map: map ? map : undefined,
                    //         path: waypoints,
                    //         strokeColor: "#0CF395",
                    //         strokeOpacity: 1,
                    //         strokeWeight: 5,
                    //     });
                    // } else {
                    //     polylineRef.current.setPath(waypoints);
                    // }

                    polyLine = new naver.maps.Polyline({
                        map: map ? map : undefined,
                        path: waypoints,
                        strokeColor: "#0CF395",
                        strokeOpacity: 1,
                        strokeWeight: 5,
                    });

                    // mainPointsRef.current.push(e.coord);
                    mainPoint.push(e.coord);
                    setWayLines((prev) => [...prev, e.coord]);

                    setMissionData((prev) => ({
                        ...prev,
                        mainPoint: {
                            latitude: e.coord.lat(),
                            longitude: e.coord.lng(),
                            height: 100,
                        },
                        points: [
                            ...prev.points,
                            {
                                latitude: e.coord.lat(),
                                longitude: e.coord.lng(),
                                height: 100,
                            },
                        ],
                        ways: [
                            ...prev.ways,
                            {
                                latitude: e.coord.lat(),
                                longitude: e.coord.lng(),
                                height: 100,
                            },
                        ],
                    }));

                    const marker = new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: e.coord,
                        draggable: true,
                        icon: {
                            // content: `<div class='wayline_marker'>${mainPointsRef.current.length}</div>`,
                            content: `<div class='wayline_marker'>${mainPoint.length}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    });

                    // pointMarkers.current.push(marker);
                    // dragResize(pointMarkers.current, marker);
                    // setDistance(polylineRef.current.getDistance());
                    // deletePoint(marker, pointMarkers.current);

                    pointsMarkers.push(marker);
                    dragResize(pointsMarkers, marker);
                    setDistance(polyLine.getDistance());
                    deletePoint(marker, pointsMarkers);

                    const createGuideLine = naver.maps.Event.addListener(
                        map,
                        "mousemove",
                        (e: { coord: naver.maps.LatLng }) => {
                            // if (guideLineRef.current) {
                            //     guideLineRef.current.setMap(null);
                            //     guideLineRef.current = null;
                            // }

                            // const lastLatLng =
                            //     pointMarkers.current[
                            //         pointMarkers.current.length - 1
                            //     ].getPosition();

                            if (guideLine) {
                                guideLine.setMap(null);
                                guideLine = null;
                            }

                            const lastLatLng =
                                pointsMarkers[
                                    pointsMarkers.length - 1
                                ].getPosition();

                            guideLine = new naver.maps.Polyline({
                                map: map ? map : undefined,
                                path: [lastLatLng, e.coord],
                                strokeColor: "#ff005e",
                                strokeWeight: 4,
                                strokeStyle: [4, 4],
                                strokeOpacity: 0.7,
                            });

                            // guideLineRef.current = new naver.maps.Polyline({
                            //     map: map ? map : undefined,
                            //     path: [lastLatLng, e.coord],
                            //     strokeColor: "#ff005e",
                            //     strokeWeight: 4,
                            //     strokeStyle: [4, 4],
                            //     strokeOpacity: 0.7,
                            // });
                        },
                    );
                    console.log(
                        "마지막 마커",
                        pointsMarkers[pointsMarkers.length - 1],
                    );

                    const endWayPointMission = naver.maps.Event.addListener(
                        // pointMarkers.current[pointMarkers.current.length - 1],
                        pointsMarkers[pointsMarkers.length - 1],
                        "click",
                        () => {
                            console.log("마지막 클릭");
                            // if (mainPointsRef.current.length > 0) {
                            //     if (guideLineRef.current) {
                            //         guideLineRef.current.setMap(null);
                            //         guideLineRef.current = null;
                            //     }

                            //     naver.maps.Event.removeListener(
                            //         endWayPointMission,
                            //     );
                            //     naver.maps.Event.removeListener(setWayPoint);
                            //     naver.maps.Event.removeListener(
                            //         createGuideLine,
                            //     );

                            //     setIsRunning(false);
                            // }
                            guideLine?.setMap(null);
                            guideLine = null;

                            naver.maps.Event.removeListener(createGuideLine);
                            naver.maps.Event.removeListener(setWayPoint);
                            setIsRunning(false);

                            naver.maps.Event.removeListener(endWayPointMission);
                        },
                    );
                },
            );
        }
    };

    const deletePoint = (
        marker: naver.maps.Marker,
        marekrs: naver.maps.Marker[],
    ) => {
        naver.maps.Event.addListener(marker, "rightclick", (e) => {
            const deleteMarker = new naver.maps.Marker({
                map: map ? map : undefined,
                position: e.coord,
                icon: {
                    content: `<div class='delete_marker'>delete</div>`,
                    anchor: new naver.maps.Point(0, 40),
                },
            });

            naver.maps.Event.addListener(deleteMarker, "click", () => {
                deleteMarker.setMap(null);
                const index = marekrs.indexOf(marker);

                if (index !== -1) {
                    marker.setMap(null);
                    // mainPointsRef.current.splice(index, 1);
                    mainPoint.splice(index, 1);
                    wayLines.splice(index, 1);

                    // if (polylineRef.current) {
                    //     polylineRef.current.setPath(mainPointsRef.current);
                    //     setDistance(polylineRef.current.getDistance());
                    // }

                    polyLine?.setPath(mainPoint);
                    if (polyLine) setDistance(polyLine.getDistance());

                    marekrs.forEach((marker, i) => {
                        marker.setIcon({
                            content: `<div class='wayline_marker'>${i + 1}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        });
                    });

                    setMissionData((prev) => ({
                        ...prev,
                        points: prev.points.filter((_, i) => i !== index),
                        ways: prev.ways.filter((_, i) => i !== index),
                    }));
                }
            });
        });
    };

    const dragResize = (
        markers: naver.maps.Marker[],
        marker: naver.maps.Marker,
    ) => {
        const resizeEvent = naver.maps.Event.addListener(
            marker,
            "drag",
            (e: { coord: naver.maps.LatLng }) => {
                const index = markers.indexOf(marker);
                if (index !== -1) {
                    // mainPointsRef.current[index] = e.coord;
                    mainPoint[index] = e.coord;
                    // if (polylineRef.current) {
                    //     polylineRef.current.setPath(mainPointsRef.current);
                    //     setDistance(polylineRef.current.getDistance());
                    // }

                    polyLine?.setPath(mainPoint);
                    if (polyLine) setDistance(polyLine.getDistance());

                    setMissionData((prev) => {
                        const updatedPoints = [...prev.points];
                        const updatedWays = [...prev.ways];

                        updatedPoints[index] = {
                            latitude: e.coord.lat(),
                            longitude: e.coord.lng(),
                            height: 100,
                        };
                        updatedWays[index] = {
                            latitude: e.coord.lat(),
                            longitude: e.coord.lng(),
                            height: 100,
                        };

                        return {
                            ...prev,
                            points: updatedPoints,
                            ways: updatedWays,
                        };
                    });
                }

                console.log(resizeEvent);
            },
        );
    };

    const submitWaypoint = async () => {
        if (
            missionData.name &&
            missionData.ways.length > 0 &&
            missionData.points.length > 0 &&
            !isRunning
        ) {
            try {
                const response = await api.post(MISSION, missionData);
                console.log("미션생성:", response);
                resetData();
                setIsHttpRequest((prev) => (prev = !prev));
                setIsRunningMission((prevMission) => ({
                    ...prevMission,
                    waypoint: false,
                    isStart: false,
                }));

                alert("웨이포인트 미션 생성 완료!");
            } catch (err) {
                console.log(err);
            }
        } else {
            alert(
                "모든 정보를 입력 또는 마지막 포인트를 클릭 후 종료 시켜 주세요!",
            );
        }
    };

    useEffect(() => {
        resetData();
    }, []);

    useEffect(() => {
        createWayPointMission();
    }, [isRunningMission.waypoint]);

    // useEffect(() => {
    //     initMissionData();
    // }, [pointMarkers.current, polylineRef.current, guideLineRef.current]);

    return (
        <>
            {isRunningMission.waypoint && (
                <div className="waypoint_content">
                    <div className="content">
                        <div className="overlay_info">
                            <span>
                                {/* 웨이포인트: {mainPointsRef.current.length} */}
                                웨이포인트: {wayLines.length}
                            </span>
                            <span>총 거리: {distance.toFixed(2)}m</span>
                        </div>

                        <div className="btn_box">
                            <Button
                                onClick={initWaypoint}
                                type="button"
                                className="submit_btn"
                            >
                                <span>초기화</span>
                            </Button>
                            <Button
                                onClick={submitWaypoint}
                                type="button"
                                className="submit_btn"
                            >
                                <span>생성</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
