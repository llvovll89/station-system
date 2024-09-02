import { useEffect, useRef, useState } from "react";
import { Mission } from "../mission/Mission";
import { ActiveType, WeatherDto } from "../../constant/type";
import { useNavigate } from "react-router-dom";
import { MainWrap } from "./MainStyle";
import { Header } from "../../components/Header";
import { Station } from "../station/Station";
import { Schedule } from "../schedule/Schedule";
import { Drone, StationDto } from "../../dto/Station";
import { DarkMode } from "../../components/Darkmode";
import { MapButton } from "../../components/MapButton";

import { MissionDto } from "../../dto/MissionDto";
import { CesiumMap } from "../3dmap/CesiumMap.tsx";
import { Weather } from "./Weather.tsx";
import { NaverMap } from "../2dmap/NaverMap.tsx";

interface RunningMission {
    currentMission: MissionDto;
    drone: Drone;
    status: number;
    latitude: number;
    longitude: number;
    seq: number;
    name: string;
    createAt: string;
    mainPoint: {
        latitude: number;
        longitude: number;
    };
}

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none);
    const [stations, setStations] = useState<StationDto[]>([]);
    const [isActive, setIsActive] = useState("");
    const [map, setMap] = useState<naver.maps.Map | null>(null);
    const [weatherData, setWeaherData] = useState<WeatherDto | null>(null);
    const [isRunningSchedule, setIsRunningSchedule] = useState(false);
    const [runningSchedule, setRunningSchedule] = useState<RunningMission[]>(
        [],
    );
    const [cesiumPosition, setCesiumPosition] = useState({
        latitude: 0,
        longitude: 0,
    })
    const [is3DMapType, setIs3DMapType] = useState<boolean>(false);
    const mapElement = useRef(null);

    const navigate = useNavigate();

    const toggleActive = (type: ActiveType) => {
        setIsActiveType((prev) => (prev === type ? ActiveType.none : type));
    };

    useEffect(() => {
        !localStorage.getItem("user") && navigate("/");
    }, []);

    useEffect(() => {
        if (!is3DMapType) {
            if (!mapElement.current || !naver) return;

            const location = new naver.maps.LatLng(35.8774, 128.6107);
            const mapOptions = {
                center: location,
                zoom: 17,
                zoomControl: false,
                mapDataControl: false,
                scaleControl: false,
                mapTypeId: naver.maps.MapTypeId.HYBRID,
                background: "#181818",
                tileTransition: false,
                disableKineticPan: false,
            };

            setMap(new naver.maps.Map(mapElement.current, mapOptions));
        }
    }, [is3DMapType]);

    return (
        <MainWrap>
            <Header
                isActive={isActive}
                setIsActive={setIsActive}
                toggleMission={() => toggleActive(ActiveType.mission)}
                toggleStation={() => toggleActive(ActiveType.station)}
                toggleSchedule={() => toggleActive(ActiveType.schedule)}
            />

            {is3DMapType ? (
                <CesiumMap
                    setWeaherData={setWeaherData}
                    setCesiumPosition={setCesiumPosition}
                    stations={stations}
                    setStations={setStations}
                    setIsRunningSchedule={setIsRunningSchedule}
                    setRunningSchedule={setRunningSchedule}
                    runningSchedule={runningSchedule}
                    isRunningSchedule={isRunningSchedule}
                />
            ) : (
                <NaverMap
                    setMap={setMap}
                    map={map}
                    mapElement={mapElement}
                    stations={stations}
                    runningSchedule={runningSchedule}
                    setWeaherData={setWeaherData}
                    setStations={setStations}
                    setIsRunningSchedule={setIsRunningSchedule}
                    setRunningSchedule={setRunningSchedule}
                />
            )}

            {activeType === ActiveType.mission && (
                <Mission
                    isActive={isActive}
                    setIsActive={setIsActive}
                    toggleMission={() => toggleActive(ActiveType.mission)}
                    map={map}
                />
            )}

            {activeType === ActiveType.station && (
                <Station
                    toggleStation={() => toggleActive(ActiveType.station)}
                    setIsActive={setIsActive}
                    map={map}
                />
            )}

            {activeType === ActiveType.schedule && (
                <Schedule
                    isRunningSchedule={isRunningSchedule}
                    setIsActive={setIsActive}
                    stations={stations}
                    toggleSchedule={() => toggleActive(ActiveType.schedule)}
                />
            )}

            {isRunningSchedule && (
                <article className="running_schedule">
                    <h1>스케줄 진행 중...</h1>
                    <div className="running_content">
                        <span className="mission_length">
                            진행 중인 미션 수 : {runningSchedule.length}
                        </span>

                        <article>
                            {runningSchedule.map((item, index) => (
                                <div key={index} className="running_list">
                                    <div className="header">
                                        <span className="chart_number">
                                            {index + 1}
                                        </span>
                                        <span>번째 스케줄</span>
                                    </div>
                                    <div className="running_grid">
                                        <span>스테이션: {item.name}</span>
                                        <span>드론: {item.drone.name}</span>
                                        <span>
                                            미션: {item.currentMission.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </article>
                    </div>
                </article>
            )}

            <DarkMode />
            <MapButton setIs3DMapType={setIs3DMapType} is3DMapType={is3DMapType} />

            {!is3DMapType ? (
                map && weatherData && (
                    <Weather
                        coords={{
                            latitude: map.getCenter().x,
                            longitude: map.getCenter().y,
                        }}
                        weatherData={weatherData}
                    />
                )
            ) : (
                cesiumPosition && weatherData && (
                    <Weather
                        coords={{
                            latitude: Number(cesiumPosition.latitude.toFixed(6)),
                            longitude: Number(cesiumPosition.longitude.toFixed(6)),
                        }}
                        weatherData={weatherData}
                    />
                )
            )}

        </MainWrap>
    );
};
