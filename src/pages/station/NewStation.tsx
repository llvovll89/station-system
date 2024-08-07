import styled from "styled-components";
import theme from "../../styles/theme";
import { Button } from "../../components/button/Button";
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { CreateStation } from "../../constant/type";
import { STATION } from "../../constant/http";
import axios from "axios";

const NewStationWrap = styled.section`
    position: absolute;
    min-width: 500px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: rgb(31, 30, 37);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 50;
    color: ${theme.color.white};

    #station_map,
    #drone_map {
        box-shadow: 0px 2px 5px rgba(255, 255, 255, 0.12);
    }

    & header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & h1 {
            font-size: 22px;
            color: ${theme.color.white};
        }

        & button {
            height: 32px;
            width: 32px;

            & svg {
                width: 22px;
                height: 22px;
            }
        }
    }

    & .content {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;

        & label {
            width: 100px;
        }

        & input {
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            height: 100%;
            width: 100%;
            padding: 0 3px 0 1rem;
            color: ${theme.color.white};
            background-color: #181818;

            &:focus {
                color: ${theme.color.primary};
                border: 1px solid ${theme.color.primary};
            }
        }

        & .name,
        & .item {
            display: flex;
            height: 42px;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
        }

        & .map {
            margin-top: 9px;
            width: 100%;
            border-radius: 5px;
            overflow: hidden;
            height: 250px;
        }

        & .content_body {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            & .station,
            & .drone {
                width: 100%;
                gap: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;

                & .header {
                    display: flex;
                    align-items: center;

                    & span {
                        font-weight: 700;
                        font-size: 18px;
                    }
                }
            }

            & .drone_content,
            & .station_content {
                margin-top: 0.5rem;
                width: 100%;
                align-items: center;
                gap: 0.75rem;
                display: flex;
                flex-direction: column;
            }
        }

        & .content_btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            & button {
                width: 100%;
                height: 52px;
                border-radius: 5px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                background-color: #181818;

                &:hover {
                    background-color: ${theme.color.primary};
                }
            }
        }
    }
`;

interface NewStationProps {
    toggleCreateStation: () => void;
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewStation = ({
    toggleCreateStation,
    setIsHttpRequest,
}: NewStationProps) => {
    const [createData, setCreateData] = useState<CreateStation>({
        name: "Untitle Station",
        latitude: "0",
        longitude: "0",
        drone: {
            name: "m30t",
            latitude: "0",
            longitude: "0",
        },
    });

    const [stationMap, setStationMap] = useState<naver.maps.Map | null>(null);
    const [droneMap, setDroneMap] = useState<naver.maps.Map | null>(null);
    const [isStep, setIsStep] = useState(1);
    const [overlays, setOverlays] = useState<{
        stationMarker: naver.maps.Marker | null;
        droneMarker: naver.maps.Marker | null;
    }>({
        stationMarker: null,
        droneMarker: null,
    });

    const stationMapElement = useRef(null);
    const droneMapElement = useRef(null);

    const stationSetCoords = (stationMap: naver.maps.Map | null) => {
        if (!stationMap) return;
        let newStationMarker: naver.maps.Marker | null = null;

        naver.maps.Event.addListener(stationMap, "click", (e) => {
            const { _lat, _lng } = e.coord;

            console.log(_lat, _lng);
            console.log(stationMap, droneMap);

            if (newStationMarker) {
                newStationMarker.setMap(null);
                newStationMarker = null;
            }

            newStationMarker = new naver.maps.Marker({
                position: new naver.maps.LatLng(_lat, _lng),
                map: stationMap,
                icon: {
                    content: `<div class='dock_marker'><span>🚍</span></div>`,
                    anchor: new naver.maps.Point(18, 18),
                },
            });

            setOverlays({
                ...overlays,
                stationMarker: newStationMarker,
            });

            setCreateData((station) => ({
                ...station,
                latitude: String(_lat),
                longitude: String(_lng),
            }));
        });
    };

    const droneSetCoords = (droneMap: naver.maps.Map | null) => {
        if (!droneMap) return;
        let newDroneMarker: naver.maps.Marker | null = null;

        naver.maps.Event.addListener(droneMap, "click", (e) => {
            const { _lat, _lng } = e.coord;

            console.log(_lat, _lng);
            console.log(stationMap, droneMap);

            if (newDroneMarker) {
                newDroneMarker.setMap(null);
                newDroneMarker = null;
            }

            newDroneMarker = new naver.maps.Marker({
                position: new naver.maps.LatLng(_lat, _lng),
                map: droneMap,
                icon: {
                    content: `<div class='drone_marker'><span>🛸</span></div>`,
                    anchor: new naver.maps.Point(16, 16),
                },
            });

            setOverlays((prevOverlays) => ({
                ...prevOverlays,
                droneMarker: newDroneMarker,
            }));

            setCreateData((data) => ({
                ...data,
                drone: {
                    ...data.drone,
                    latitude: String(_lat),
                    longitude: String(_lng),
                },
            }));
        });
    };

    const createStation = async () => {
        if (
            createData.name === "" ||
            createData.latitude === "0" ||
            createData.longitude === "0"
        ) {
            alert("스테이션 정보를 입력해 주세요.");
            return;
        }

        if (
            createData.drone.name === "" ||
            createData.drone.latitude === "0" ||
            createData.drone.longitude === "0"
        ) {
            alert("드론 정보를 입력해 주세요.");
            return;
        }

        try {
            const params = {
                name: createData.name,
                latitude: Number(createData.latitude),
                longitude: Number(createData.longitude),
                drone: {
                    name: createData.drone.name,
                    latitude: Number(createData.drone.latitude),
                    longitude: Number(createData.drone.longitude),
                },
            };

            const response = await axios.post(STATION, params, {
                withCredentials: true,
            });
            const data = await response.data;
            console.log(data);

            if (overlays.droneMarker) {
                overlays.droneMarker.setMap(null);
            }

            if (overlays.droneMarker) {
                overlays.droneMarker.setMap(null);
            }

            setOverlays({
                stationMarker: null,
                droneMarker: null,
            });
            setIsHttpRequest((prev) => !prev);
            resetToggleStation();
        } catch (err) {
            console.log(err);
        }
    };

    const resetToggleStation = () => {
        toggleCreateStation();
        setCreateData({
            name: "",
            latitude: "0",
            longitude: "0",
            drone: {
                name: "",
                latitude: "0",
                longitude: "0",
            },
        });
    };

    const nextStep = () => {
        if (createData.latitude !== "0" && createData.longitude !== "0") {
            setIsStep(2);
        } else {
            alert("위 / 경도 값을 지도에서 선택 해주세요!");
        }
    };

    useEffect(() => {
        if (isStep === 1 && stationMapElement.current) {
            const location = new naver.maps.LatLng(35.8774, 128.6107);
            const mapOptions = {
                center: location,
                zoom: 17,
                zoomControl: false,
                mapDataControl: false,
                scaleControl: false,
            };

            const map = new naver.maps.Map(
                stationMapElement.current,
                mapOptions,
            );
            setStationMap(map);
            stationSetCoords(map);
        }

        if (isStep === 2 && droneMapElement.current) {
            const location = new naver.maps.LatLng(35.8774, 128.6107);
            const mapOptions = {
                center: location,
                zoom: 17,
                zoomControl: false,
                mapDataControl: false,
                scaleControl: false,
            };

            const map = new naver.maps.Map(droneMapElement.current, mapOptions);
            setDroneMap(map);
            droneSetCoords(map);
        }
    }, [isStep]);

    return (
        <>
            <NewStationWrap>
                <header>
                    <h1>스테이션 추가</h1>
                    <Button type={"button"} onClick={toggleCreateStation}>
                        <IoClose />
                    </Button>
                </header>

                <article className="content">
                    <div className="content_body">
                        {isStep === 1 && (
                            <>
                                <div className="name">
                                    <label htmlFor="create_name">
                                        스테이션명
                                    </label>
                                    <input
                                        type={"text"}
                                        value={createData.name}
                                        autoComplete="off"
                                        id="create_name"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            setCreateData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <section className="station">
                                    <div className="header">
                                        <span>&lt;스테이션&gt;</span>
                                    </div>

                                    <div className="station_content">
                                        <div className="item">
                                            <label htmlFor="station_latitude">
                                                위도
                                            </label>
                                            <input
                                                type={"text"}
                                                value={createData.latitude}
                                                id="station_latitude"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setCreateData((prev) => ({
                                                        ...prev,
                                                        latitude:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="item">
                                            <label htmlFor="station_longitude">
                                                경도
                                            </label>
                                            <input
                                                type={"text"}
                                                value={createData.longitude}
                                                id="station_longitude"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setCreateData((prev) => ({
                                                        ...prev,
                                                        longitude:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="map">
                                            <div
                                                id="station_map"
                                                className="map"
                                                ref={stationMapElement}
                                                style={{
                                                    width: "100%",
                                                    height: "250px",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}

                        {isStep === 2 && (
                            <section className="drone">
                                <div className="header">
                                    <span>&lt;드론&gt;</span>
                                </div>

                                <div className="drone_content">
                                    <div className="item">
                                        <label htmlFor="drone_name">
                                            드론명
                                        </label>
                                        <input
                                            type={"text"}
                                            value={createData.drone.name}
                                            id="drone_name"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setCreateData((prev) => ({
                                                    ...prev,
                                                    drone: {
                                                        ...prev.drone,
                                                        name: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="item">
                                        <label htmlFor="drone_latitude">
                                            드론위도
                                        </label>
                                        <input
                                            type={"text"}
                                            value={createData.drone.latitude}
                                            id="drone_latitude"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setCreateData((prev) => ({
                                                    ...prev,
                                                    drone: {
                                                        ...prev.drone,
                                                        latitude:
                                                            e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="item">
                                        <label htmlFor="drone_longitude">
                                            드론경도
                                        </label>
                                        <input
                                            type={"text"}
                                            value={createData.drone.longitude}
                                            id="drone_longitude"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setCreateData((prev) => ({
                                                    ...prev,
                                                    drone: {
                                                        ...prev.drone,
                                                        longitude:
                                                            e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="map">
                                        <div
                                            id="drone_map"
                                            className="map"
                                            ref={droneMapElement}
                                            style={{
                                                width: "100%",
                                                height: "250px",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="content_btn">
                        {isStep === 1 && (
                            <>
                                <Button
                                    type={"button"}
                                    onClick={resetToggleStation}
                                >
                                    취소
                                </Button>
                                <Button type={"button"} onClick={nextStep}>
                                    다음
                                </Button>
                            </>
                        )}
                        {isStep === 2 && (
                            <>
                                <Button
                                    type={"button"}
                                    onClick={() => {
                                        setCreateData((prevData) => ({
                                            ...prevData,
                                            latitude: "0",
                                            longitude: "0",
                                        }));

                                        setIsStep(1);
                                    }}
                                >
                                    이전
                                </Button>
                                <Button type={"button"} onClick={createStation}>
                                    생성
                                </Button>
                            </>
                        )}
                    </div>
                </article>
            </NewStationWrap>

            <div className="global_wrap"></div>
        </>
    );
};
