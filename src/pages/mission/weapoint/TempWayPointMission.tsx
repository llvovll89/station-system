import { useEffect, useRef, useState } from "react";
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
    const [markers, setMarkers] = useState([] as naver.maps.Marker[]);

    let pointMarkers = [] as naver.maps.Marker[];
    // const pointMarkers = useRef<naver.maps.Marker[]>([]);
    const polylineRef = useRef<naver.maps.Polyline | null>(null);
    // const guideLineRef = useRef<naver.maps.Polyline | null>(null);
    const mainPointsRef = useRef<naver.maps.LatLng[]>([]);

    const resetData = () => {
        if (isRunning) {
            alert("마지막 포인트 클릭 후 다시 초기화 해주세요!");
            return;
        }

        // 모든 마커 제거
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        setMarkers([]);
        pointMarkers = [];

        // 모든 포인트 초기화
        mainPointsRef.current = [];

        // 폴리라인 제거
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

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
            let guideLine: naver.maps.Polyline | null = null;

            const setWayPoint = naver.maps.Event.addListener(
                map,
                "click",
                (e: { coord: naver.maps.LatLng }) => {
                    waypoints.push(e.coord);

                    console.log(111);

                    if (!polylineRef.current) {
                        polylineRef.current = new naver.maps.Polyline({
                            map: map ? map : undefined,
                            path: waypoints,
                            strokeColor: "#0CF395",
                            strokeOpacity: 1,
                            strokeWeight: 5,
                        });
                    } else {
                        polylineRef.current.setPath(waypoints);
                    }

                    mainPointsRef.current.push(e.coord);
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
                            content: `<div class='wayline_marker'>${mainPointsRef.current.length}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    });

                    // pointMarkers.current.push(marker);
                    pointMarkers.push(marker);
                    setMarkers((prev) => [...prev, marker]);
                    dragResize(pointMarkers, marker);
                    setDistance(polylineRef.current.getDistance());
                    deletePoint(marker, pointMarkers);

                    const createGuideLine = naver.maps.Event.addListener(
                        map,
                        "mousemove",
                        (e: { coord: naver.maps.LatLng }) => {
                            if (guideLine) {
                                guideLine.setMap(null);
                                guideLine = null;
                            }

                            const lastLatLng =
                                pointMarkers[
                                    pointMarkers.length - 1
                                ].getPosition();

                            guideLine = new naver.maps.Polyline({
                                map: map ? map : undefined,
                                path: [lastLatLng, e.coord],
                                strokeColor: "#ff005e",
                                strokeWeight: 4,
                                // strokeStyle: [4, 4],
                                strokeOpacity: 0.7,
                            });

                            console.log("mousemove");
                        },
                    );

                    const endWayPointMission = naver.maps.Event.addListener(
                        pointMarkers[pointMarkers.length - 1],
                        "click",
                        () => {
                            naver.maps.Event.removeListener(setWayPoint);
                            naver.maps.Event.removeListener(createGuideLine);
                            naver.maps.Event.removeListener(endWayPointMission);

                            setIsRunning(false);

                            if (guideLine) {
                                guideLine.setMap(null);
                                guideLine = null;
                            }
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
                    mainPointsRef.current.splice(index, 1);
                    wayLines.splice(index, 1);

                    if (polylineRef.current) {
                        polylineRef.current.setPath(mainPointsRef.current);
                        setDistance(polylineRef.current.getDistance());
                    }

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
                    mainPointsRef.current[index] = e.coord;
                    if (polylineRef.current) {
                        polylineRef.current.setPath(mainPointsRef.current);
                        setDistance(polylineRef.current.getDistance());
                    }

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
                setIsHttpRequest((prev) => (prev = !prev));
                setIsRunningMission((prevMission) => ({
                    ...prevMission,
                    waypoint: false,
                    isStart: false,
                }));

                resetData();
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
        createWayPointMission();
    }, [isRunningMission.waypoint]);

    return (
        <>
            {isRunningMission.waypoint && (
                <div className="waypoint_content">
                    <div className="content">
                        <div className="overlay_info">
                            <span>웨이포인트: {wayLines.length}</span>
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
