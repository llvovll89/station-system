import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { Button } from "../../components/button/Button";
import { MissionDto } from "../../dto/MissionDto";

declare global {
    interface Window {
        kakao: any;
    }
}

const mapStyle = {
    width: '100vw',
    height: '100vh'
};


interface pointState {
    title: string;
    latlng: kakao.maps.LatLng;
}

export const Mission = () => {
    const navigate = useNavigate();
    const [missions, setMissions] = useState<MissionDto>({
        seq: 0,
        name: "",
        type: 0,
        mainPoint: null,
        createdAt: "",
        updatedAt: ""
    });
    const [userLocalData, setUserLocalData] = useState<string>("");
    const [points, setPoints] = useState<pointState[]>([]);
    const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
    const [maps, setMaps] = useState<null>(null);

    const mapRef = useRef<HTMLElement | null>(null);



    useEffect(() => {
        if (localStorage.getItem("id")) {
            setUserLocalData(JSON.stringify(localStorage.getItem("id")));
        } else {
            navigate('/');
        }
    }, [navigate, userLocalData]);

    return (
        <MissionWrap>
            <h1>미션 페이지</h1>

            <div>
                {/* <Button onClick={getMission} type="button" className="import_mission" text="랜덤미션"></Button>
                    <Button onClick={getPolygon} type="button" className="import_mission" text="다각형그리기"></Button>
                    <Button onClick={startPaintMarkers} type="button" className="import_mission" text="마커생성"></Button> */}
            </div>

        </MissionWrap>
    )
};