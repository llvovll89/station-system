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
    const [overlays, setOverlays] = useState({
        wayLine: null as naver.maps.Polyline | null,
        guideLine: null as naver.maps.Polyline | null,
        mainiPoints: [] as naver.maps.LatLng[],
        markers: [] as naver.maps.Marker[],
    });

    let pointsMarkers: naver.maps.Marker[] = [];
    let polyLine: naver.maps.Polyline | null = null;
    let guideLine: naver.maps.Polyline | null = null;
    let mainPoint: naver.maps.LatLng[] = [];

    let createGuideLineListener: any = null;
    let setWayPointListener: any = null;
    let endWayPointMissionListener: any = null;

    const resetData = () => {
        if (isRunning) {
            alert("마지막 포인트 클릭 후 다시 초기화 해주세요!");
            return;
        }

        overlays.wayLine && overlays.wayLine.setMap(null);
        overlays.guideLine && overlays.guideLine.setMap(null);
        overlays.markers.forEach((m) => m.setMap(null));

        setOverlays({
            wayLine: null,
            guideLine: null,
            mainiPoints: [],
            markers: [],
        });

        pointsMarkers = [];
        polyLine = null;
        guideLine = null;
        mainPoint = [];

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
            setWayPointListener = naver.maps.Event.addListener(
                map,
                "click",
                (e: { coord: naver.maps.LatLng }) => {
                    waypoints.push(e.coord);

                    polyLine = new naver.maps.Polyline({
                        map: map ? map : undefined,
                        path: waypoints,
                        strokeColor: "#0CF395",
                        strokeOpacity: 1,
                        strokeWeight: 5,
                    });

                    mainPoint.push(e.coord);

                    setOverlays((prev) => ({
                        ...prev,
                        wayLine: polyLine,
                        mainiPoints: [...prev.mainiPoints, e.coord],
                    }));
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
                            content: `<div class='wayline_marker'>${mainPoint.length}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    });

                    pointsMarkers.push(marker);
                    setOverlays((prev) => ({
                        ...prev,
                        markers: [...prev.markers, marker],
                    }));
                    dragResize(pointsMarkers, marker);
                    setDistance(polyLine.getDistance());
                    deletePoint(marker, pointsMarkers);

                    createGuideLineListener = naver.maps.Event.addListener(
                        map,
                        "mousemove",
                        (e: { coord: naver.maps.LatLng }) => {
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

                            setOverlays((prev) => ({
                                ...prev,
                                guideLine: guideLine,
                            }));

                            console.log("guideLine move");
                        },
                    );

                    endWayPointMissionListener = naver.maps.Event.addListener(
                        pointsMarkers[pointsMarkers.length - 1],
                        "click",
                        () => {
                            overlays.guideLine &&
                                overlays.guideLine.setMap(null);

                            guideLine?.setMap(null);
                            guideLine = null;

                            console.log("click");

                            naver.maps.Event.removeListener(
                                createGuideLineListener,
                            );
                            naver.maps.Event.removeListener(
                                setWayPointListener,
                            );
                            naver.maps.Event.removeListener(
                                endWayPointMissionListener,
                            );

                            setIsRunning(false);
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
                    mainPoint.splice(index, 1);
                    wayLines.splice(index, 1);
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
        naver.maps.Event.addListener(
            marker,
            "drag",
            (e: { coord: naver.maps.LatLng }) => {
                const index = markers.indexOf(marker);
                if (index !== -1) {
                    mainPoint[index] = e.coord;

                    if (polyLine) {
                        polyLine.setMap(null);
                    }

                    mainPoint[index] = e.coord;

                    polyLine = new naver.maps.Polyline({
                        map: map ? map : undefined,
                        path: mainPoint,
                        strokeColor: "#0CF395",
                        strokeOpacity: 1,
                        strokeWeight: 5,
                    });

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

                alert("웨이포인트 미션 생성 완료!");
                resetData();
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
