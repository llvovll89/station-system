import { IoClose } from "react-icons/io5";
import { Button } from "../../../components/button/Button";
import { useEffect, useState } from "react";
import { StationDto } from "../../../dto/Station";
import { IoCreateOutline } from "react-icons/io5";
import { StationWrap } from "./StationListStyle";
import { deleteStation, getStations } from "../../../util/requestHttp";
import DeleteIcon from "../../../assets/image/icon/ico_trash(w).png";
import UpdateIcon from "../../../assets/image/icon/ico_edit(w).png";

interface StationListProps {
    toggleStation: () => void;
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
    isHttpRequest: boolean;
    toggleCreateStation: () => void;
    map: naver.maps.Map | null;
}

export const StationList = ({
    toggleStation,
    setIsActive,
    isHttpRequest,
    toggleCreateStation,
    map,
}: StationListProps) => {
    const [stations, setStations] = useState<StationDto[]>([]);
    const [selectedStation, setSelectedStation] = useState<StationDto | null>(
        null,
    );

    const toggleActiveStation = () => {
        toggleStation();
        setIsActive("");
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

    useEffect(() => {
        const fetchStation = async () => {
            const data = await getStations();
            setStations(data);
        };

        fetchStation();
    }, [isHttpRequest]);

    return (
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
                        <IoClose style={{ width: "24PX", height: "24px" }} />
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
                                        alert("아직 구현 안됬습니다.");
                                        // updateStation(station, params)
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
                                    onClick={(e) => deleteStation(station, e)}
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
                                        station.status === 0 ? "idle" : "active"
                                    }
                                >
                                    {station.status === 0
                                        ? " 대기중"
                                        : " 작동중"}
                                </span>
                            </div>
                            <div className="coords">
                                <span>
                                    위도: {Number(station.latitude.toFixed(6))}
                                </span>
                                <span>
                                    경도: {Number(station.longitude.toFixed(6))}
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
    );
};
