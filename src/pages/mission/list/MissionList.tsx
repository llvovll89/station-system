import { Button } from "../../../components/button/Button";
import { IoClose, IoCreateOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { MissionDto } from "../../../dto/MissionDto";
import { MissionListWrap } from "./MissionListStyle";
import axios from "axios";

import DeleteIcon from "../../../assets/image/icon/ico_trash(w).png";
import UpdateIcon from "../../../assets/image/icon/ico_edit(w).png";
import { getMissions } from "../../../util/requestHttp";
import { MISSION } from "../../../constant/http";

interface MissionListProps {
    toggleMission: () => void;
    map: naver.maps.Map | null;
    isActive: string;
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
    isCreateMission: boolean;
    isHttpRequest: boolean;
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>;
    toggleCreateMission: () => void;
    isRunningMission: {
        waypoint: boolean;
        grid: boolean;
        isStart: boolean;
    };
    initMissionData: () => void;
}

export const MissionList = ({
    toggleMission,
    map,
    setIsActive,
    isCreateMission,
    isHttpRequest,
    setIsHttpRequest,
    toggleCreateMission,
    initMissionData,
    isActive,
}: MissionListProps) => {
    const [missions, setMissions] = useState<MissionDto[]>([]);
    const [selectMission, setSelectMission] = useState<null | MissionDto>(null);
    const [overlayData, setOverlayData] = useState({
        distance: "",
        areaSize: "",
    });
    const [isUpdateMission, setIsUpdateMission] = useState(false);
    const [isSelectInfo, setIsSelectInfo] = useState(false);
    const [currentMapElements, setCurrentMapElements] = useState<any[]>([]);
    const [infoMission, setInfoMission] = useState<MissionDto>({
        seq: 0,
        name: "",
        type: 0,
        mainPoint: {
            latitude: 0,
            longitude: 0,
            height: 100,
        },
        createdAt: "",
        updatedAt: "",
        points: [],
        ways: [],
    });

    const closeMissionList = () => {
        clearMapElements();
        setIsActive("");
        toggleMission();
        initMissionData();
    };

    const updateModal = (e: React.MouseEvent, mission: MissionDto) => {
        e.stopPropagation();

        getInfoMission(mission);
        setIsUpdateMission((prev) => !prev);
    };

    const clearMapElements = () => {
        currentMapElements.forEach((element) => {
            console.log("element", element);
            element.setMap(null);
        });

        setCurrentMapElements((prev) => {
            prev.forEach((el) => el.setMap(null));
            return [];
        });

        setOverlayData({
            ...overlayData,
            distance: "",
            areaSize: "",
        });
    };

    const getInfoMission = async (mission: MissionDto) => {
        if (selectMission && mission.seq === selectMission.seq) {
            setSelectMission(null);
            setIsSelectInfo(false);
            clearMapElements();

            if (isUpdateMission) {
                setIsUpdateMission(false);
            }
        } else {
            if (isUpdateMission) {
                setIsUpdateMission(false);
            }

            setSelectMission(mission);

            try {
                const { seq } = mission;
                const response = await axios.get(`${MISSION}/${seq}`, {
                    withCredentials: true,
                });
                const data = await response.data;

                setInfoMission({
                    ...infoMission,
                    seq: data.seq,
                    name: data.name,
                    type: data.type,
                    mainPoint: data.mainPoint,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    transverseRedundancy: data.transverseRedundancy,
                    longitudinalRedundancy: data.longitudinalRedundancy,
                    points: data.points,
                    ways: data.ways,
                });

                setIsSelectInfo(true);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const setInfoDataForMap = () => {
        clearMapElements();

        if (infoMission.type === 0) {
            const polyline = new naver.maps.Polyline({
                map: map ? map : undefined,
                path: infoMission.ways.map(
                    (p) => new naver.maps.LatLng(p.latitude, p.longitude),
                ),
                strokeColor: "#2eb573",
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeStyle: "solid",
            });

            setOverlayData({
                ...overlayData,
                distance: polyline.getDistance().toFixed(2),
            });

            const markers = infoMission.ways.map(
                (p, index) =>
                    new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: new naver.maps.LatLng(
                            p.latitude,
                            p.longitude,
                        ),
                        icon: {
                            content: `<div class='wayline_marker'>${index + 1}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    }),
            );

            map && map.fitBounds(polyline.getBounds());
            setCurrentMapElements([polyline, ...markers]);
        } else {
            const mainPoints: naver.maps.Marker[] = [];
            infoMission.points.forEach((p) => {
                mainPoints.push(
                    new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: new naver.maps.LatLng(
                            p.latitude,
                            p.longitude,
                        ),
                        icon: {
                            content: `<div class='wayline_marker'></div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    }),
                );
            });

            const polygon = new naver.maps.Polygon({
                map: map ? map : undefined,
                paths: [
                    infoMission.points.map(
                        (p) => new naver.maps.LatLng(p.latitude, p.longitude),
                    ),
                ],
                strokeColor: "#0080DE",
                strokeOpacity: 1,
                strokeWeight: 4,
                fillColor: "#0080DE",
                fillOpacity: 0.1,
            });

            const polyline = new naver.maps.Polyline({
                map: map ? map : undefined,
                path: infoMission.ways.map(
                    (p) => new naver.maps.LatLng(p.latitude, p.longitude),
                ),
                strokeColor: "#2eb573",
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeStyle: "solid",
            });

            setOverlayData({
                ...overlayData,
                areaSize: polygon.getAreaSize().toFixed(2),
                distance: polyline.getDistance().toFixed(2),
            });

            map && map.fitBounds(polygon.getBounds());

            console.log(polygon, polyline);
            setCurrentMapElements([...mainPoints, polygon, polyline]);
        }
    };

    const deleteMission = async (mission: MissionDto, e: React.MouseEvent) => {
        e.stopPropagation();
        const deleteAlert = confirm("정말 삭제 하시겠습니까?");

        if (deleteAlert) {
            try {
                const { seq } = mission;
                const response = await axios.delete(`${MISSION}/${seq}`, {
                    withCredentials: true,
                });
                const data = await response.data;
                console.log(data);
                clearMapElements();
                setIsHttpRequest((prev) => !prev);
            } catch (err) {
                console.log(err);
            }
        } else {
            return;
        }
    };

    const updeateMission = async (infoMission: MissionDto) => {
        try {
            const { seq } = infoMission;
            const response = await axios.put(`${MISSION}/${seq}`, infoMission, {
                withCredentials: true,
            });

            console.log(response.data);
            setIsUpdateMission((prev) => !prev);
            setIsHttpRequest((prev) => !prev);
        } catch (err) {
            console.log(err);
        }
    };

    const formatDateString = (dateString: any) => {
        return dateString.replace("T", " ");
    };

    useEffect(() => {
        const fetchMissions = async () => {
            const data = await getMissions();
            setMissions(data);
            setIsHttpRequest(false);
        };

        fetchMissions();
    }, [isHttpRequest]);

    useEffect(() => {
        if (isSelectInfo) {
            setInfoDataForMap();
        }
    }, [infoMission]);

    useEffect(() => {
        if (isCreateMission) {
            clearMapElements();
            setIsUpdateMission(false);
            setIsSelectInfo(false);
            setSelectMission(null);
        }
    }, [isCreateMission]);

    useEffect(() => {
        return () => {
            console.log("unmount missionList");
            clearMapElements();
        };
    }, []);

    useEffect(() => {
        clearMapElements();
        initMissionData();
    }, [isActive]);

    return (
        <MissionListWrap>
            <header>
                <h1>미션</h1>

                <div className="header_btn">
                    <Button type={"button"} onClick={toggleCreateMission}>
                        <IoCreateOutline
                            style={{ width: "24PX", height: "24px" }}
                        />
                    </Button>

                    <Button type={"button"} onClick={closeMissionList}>
                        <IoClose style={{ width: "24px", height: "24px" }} />
                    </Button>
                </div>
            </header>

            <article className="container">
                <div className="content">
                    {missions.length > 0 &&
                        missions.map((mission) => (
                            <ul
                                className={`mission ${selectMission && selectMission.seq === mission.seq ? "active" : ""}`}
                                key={mission.seq}
                                onClick={() => getInfoMission(mission)}
                            >
                                <header className="mission_header">
                                    <p className="mission_name">
                                        {mission.name}
                                    </p>

                                    <div className="content_actios">
                                        <button
                                            onClick={(e) =>
                                                updateModal(e, mission)
                                            }
                                        >
                                            <img
                                                src={UpdateIcon}
                                                alt="update"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                }}
                                            />
                                        </button>
                                        <button
                                            onClick={(e) =>
                                                deleteMission(mission, e)
                                            }
                                        >
                                            <img
                                                src={DeleteIcon}
                                                alt="update"
                                                style={{
                                                    width: "20px",
                                                    height: "20xp",
                                                }}
                                            />
                                        </button>
                                    </div>
                                </header>

                                <div className="content">
                                    <div className="mission_type">
                                        <span>타입</span>
                                        <span>
                                            {mission.type === 0
                                                ? "웨이포인트"
                                                : "그리드"}
                                        </span>
                                    </div>

                                    <div className="date">
                                        <div>
                                            <span>createdAt: </span>
                                            <span>
                                                {formatDateString(
                                                    mission.createdAt,
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <span>updatedAt: </span>
                                            <span>
                                                {formatDateString(
                                                    mission.updatedAt,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                        ))}
                </div>
            </article>

            {isUpdateMission && (
                <article className="update_mission">
                    <header>
                        <div className="header_title">
                            <span>미션 수정</span>
                            <span className="mission_type">
                                (
                                {infoMission.type === 0
                                    ? "웨이포인트"
                                    : "그리드"}
                                )
                            </span>
                        </div>
                        <div className="content_actios">
                            <Button
                                className="close_btn"
                                type="button"
                                onClick={() =>
                                    setIsUpdateMission((prev) => !prev)
                                }
                            >
                                <span>X</span>
                            </Button>
                        </div>
                    </header>

                    <div className="content">
                        <div className="top">
                            <label htmlFor="name">미션명</label>
                            <input
                                type="text"
                                value={infoMission.name}
                                onChange={(e) =>
                                    setInfoMission({
                                        ...infoMission,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="ways">
                            {infoMission.type === 0 ? (
                                <div>
                                    <span>웨이포인트:</span>
                                    <span>{infoMission.ways.length}</span>
                                </div>
                            ) : (
                                <div>
                                    <span>사진:</span>
                                    <span>{infoMission.ways.length}</span>
                                </div>
                            )}
                            <div>
                                <span>도형 포인트:</span>
                                <span>{infoMission.points.length}</span>
                            </div>
                        </div>

                        <div className="date">
                            <div>
                                <span>createdAt: </span>
                                <span>
                                    {formatDateString(infoMission.createdAt)}
                                </span>
                            </div>
                            <div>
                                <span>updatedAt: </span>
                                <span>
                                    {formatDateString(infoMission.updatedAt)}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="update_btn"
                            onClick={() => updeateMission(infoMission)}
                        >
                            <span>수정하기</span>
                        </Button>
                    </div>
                </article>
            )}

            {isSelectInfo && (
                <article className="mission_info">
                    <header>
                        <p>{infoMission.name}</p>
                    </header>

                    <div className="content">
                        <div className="area">
                            <span>비행거리 {overlayData.distance} m</span>
                            <span>웨이포인트 {infoMission.points.length}</span>
                        </div>
                        {overlayData.areaSize && (
                            <div className="area">
                                <span>
                                    비행면적 {overlayData.areaSize} 제곱미터
                                </span>
                            </div>
                        )}
                    </div>
                </article>
            )}
        </MissionListWrap>
    );
};
