import { IoClose } from "react-icons/io5";
import { Button } from "../../../components/button/Button";
import { useEffect, useState } from "react";
import { StationDto } from "../../../dto/Station";
import { IoCreateOutline } from "react-icons/io5";
import { StationWrap } from "./StationListStyle";
import { getStations } from "../../../util/requestHttp";
import DeleteIcon from "../../../assets/image/icon/ico_trash(w).png";
import UpdateIcon from "../../../assets/image/icon/ico_edit(w).png";
import { Input } from "../../../components/Input";
import api from "../../../api/api";
import { STATION } from "../../../constant/Routes";

interface StationListProps {
    toggleStation: () => void;
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
    isHttpRequest: boolean;
    toggleCreateStation: () => void;
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>;
    map: naver.maps.Map | null;
}

export const StationList = ({
    toggleStation,
    setIsActive,
    isHttpRequest,
    toggleCreateStation,
    setIsHttpRequest,
    map,
}: StationListProps) => {
    const [stations, setStations] = useState<StationDto[]>([]);
    const [selectedStation, setSelectedStation] = useState<StationDto>({
        seq: 0,
        name: "",
        latitude: 0,
        longitude: 0,
        status: 0,
        createdAt: "",
        drone: {
            seq: 0,
            name: "",
            latitude: 0,
            longitude: 0,
        },
    });
    const [isFixed, setIsFixed] = useState(false);

    const toggleActiveStation = () => {
        toggleStation();
        setIsActive("");
    };

    const deleteStation = async (station: StationDto, e: React.MouseEvent) => {
        e.stopPropagation();
        const isConfirmd = confirm(`${station.name}을 정말 삭제 하시겠습니까?`);

        if (isConfirmd) {
            try {
                const response = await api.delete(`${STATION}/${station.seq}`);
                setIsHttpRequest((prev) => !prev);
                console.log(`삭제 완료:`, response.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            return;
        }
    };

    const selectStation = (station: StationDto) => {
        setSelectedStation(station);

        const coords = new naver.maps.LatLng(
            station.latitude,
            station.longitude,
        ) as any;

        if (map) {
            map.panToBounds(new naver.maps.LatLngBounds(coords));
        }
    };

    const updateStation = async () => {
        const isConfirmd = confirm("스테이션을 수정 하시겠습니까?");

        if (isConfirmd) {
            try {
                const response = await api.put(
                    `${STATION}/${selectedStation.seq}`,
                    selectedStation,
                );
                setIsFixed((prev) => !prev);
                setIsHttpRequest((prev) => !prev);
                console.log(`수정 완료:`, response.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("취소");
        }
    };

    useEffect(() => {
        const fetchStation = async () => {
            const data = await getStations();
            setStations(data);
        };

        fetchStation();
    }, [isHttpRequest]);

    return (
        <>
            {isFixed && <section className="station_update_wrap"></section>}
            <StationWrap>
                <header>
                    <h1>스테이션</h1>

                    <div className="btn_content">
                        <Button
                            type={"button"}
                            onClick={toggleCreateStation}
                            className="create_btn"
                        >
                            <IoCreateOutline
                                style={{ width: "24PX", height: "24px" }}
                            />
                        </Button>

                        <Button type={"button"} onClick={toggleActiveStation}>
                            <IoClose
                                style={{ width: "24PX", height: "24px" }}
                            />
                        </Button>
                    </div>
                </header>

                <article className="container">
                    {stations.map((station) => (
                        <section
                            className={`content ${selectedStation === station ? "selected" : ""}`}
                            key={station.seq}
                            onClick={() => selectStation(station)}
                        >
                            <div className="content_header">
                                <h1>{station.name}</h1>

                                <div className="content_header_items">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectStation(station);
                                            setIsFixed((prev) => !prev);
                                        }}
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
                                            deleteStation(station, e)
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
                            </div>

                            <div className="content_body">
                                <div>
                                    <span>상태: </span>
                                    <span
                                        className={
                                            station.status === 0
                                                ? "idle"
                                                : "active"
                                        }
                                    >
                                        {station.status === 0
                                            ? " 대기중"
                                            : " 작동중"}
                                    </span>
                                </div>
                                <div className="coords">
                                    <span>
                                        위도:{" "}
                                        {Number(station.latitude.toFixed(6))}
                                    </span>
                                    <span>
                                        경도:{" "}
                                        {Number(station.longitude.toFixed(6))}
                                    </span>
                                </div>
                            </div>

                            <div className="content_drone">
                                <div className="drone">
                                    <span>드론: </span>
                                    <span className="name">
                                        {station.drone.name}
                                    </span>
                                </div>
                            </div>
                        </section>
                    ))}
                </article>
            </StationWrap>
            {isFixed && (
                <div className="updated_station">
                    <header>
                        <span>스테이션 수정</span>
                        <Button
                            type={"button"}
                            onClick={() => setIsFixed(false)}
                        >
                            <IoClose
                                style={{ width: "20px", height: "20px" }}
                            />
                        </Button>
                    </header>

                    <div className="input_area">
                        <label htmlFor="station_name">스테이션 이름</label>
                        <Input
                            id="station_name"
                            type="text"
                            value={selectedStation.name}
                            onChange={(e) =>
                                setSelectedStation((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="update_sation_btns">
                        <Button
                            type="button"
                            onClick={() => {
                                setIsFixed(false);
                                setSelectedStation({
                                    seq: 0,
                                    name: "",
                                    latitude: 0,
                                    longitude: 0,
                                    status: 0,
                                    createdAt: "",
                                    drone: {
                                        seq: 0,
                                        name: "",
                                        latitude: 0,
                                        longitude: 0,
                                    },
                                });
                            }}
                        >
                            <span>취소</span>
                        </Button>
                        <Button type="button" onClick={updateStation}>
                            <span>수정하기</span>
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
