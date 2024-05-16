import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { NaverMap } from "../../components/Maps";
import { CreateMission } from "./createmission/CreateMission";
import { Button } from "../../components/button/Button";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";

export const Mission = () => {
    const [isCreateMission, setIsCreateMission] = useState(false);
    const [selectMission, setSelectMission] = useState("");
    const [isCrateWaypoint, setIsCreateWayPoint] = useState(false);

    const navigate = useNavigate();
    const toggleCreateMission = () => {
        setIsCreateMission((prev) => !prev);
    };

    const initCreateMission = () => {
        setIsCreateMission(false);
        setIsCreateWayPoint(false);
        setSelectMission("");
    };

    const submitCreateMission = () => {
        toggleCreateMission();
        setIsCreateWayPoint(true);
    }

    const getMission = async () => {
        const response = await axios.get('http://13.124.113.180:8080/mission');
        const data = response.data();
        console.log(data);
    }

    useEffect(() => {
        !localStorage.getItem("user") && navigate("/");
    }, []);

    useEffect(() => {
        // getMission();
    }, []);

    return (
        <MissionWrap>
            <NaverMap latitude={35.87772056157816} longitude={128.6110784825801} isCreateWaypoint={isCrateWaypoint} />
            {isCreateMission && <CreateMission closeCreateMission={toggleCreateMission} submitCreateMission={submitCreateMission} selectMission={selectMission} setSelectMission={setSelectMission}/>}
            {selectMission && <span className="mission_type">타입: {selectMission}</span>}

            <Button text="생성" onClick={toggleCreateMission} type="button" className="create_mission" />
            <div onClick={initCreateMission} className="init_mission">
                <AiOutlineReload />
            </div>
        </MissionWrap>
    )
};