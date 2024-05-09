import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { MissionDto } from "../../dto/MissionDto";
import { NaverMap } from "../../components/Maps";

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


    useEffect(() => {
        if (localStorage.getItem("id")) {
            setUserLocalData(JSON.stringify(localStorage.getItem("id")));
        } else {
            navigate('/');
        }
    }, [navigate, userLocalData]);

    return (
        <MissionWrap>
            <NaverMap latitude={35.87772056157816} longitude={128.6110784825801} width="calc(100% - 50px)" height="100vh" margin="0 0 0 50px" />
        </MissionWrap>
    )
};