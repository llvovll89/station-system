import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { NaverMap } from "../../components/Maps";
import { CreateMission } from "./createmission/CreateMission";
import { Button } from "../../components/button/Button";

export const Mission = () => {
    const [isCreateMission, setIsCreateMission] = useState(false);
    const [selectMission, setSelectMission] = useState("");
    const [isCrateWaypoint, setIsCreateWayPoint] = useState(false);
    const [wayPoints, setWayPoints] = useState([]);
    const [distance, setDistance] = useState("");

    const navigate = useNavigate();
    const toggleCreateMission = () => {
        setIsCreateMission((prev) => !prev);
    }

    const submitCreateMission = () => {
        toggleCreateMission();
        setIsCreateWayPoint(true);
    }

    useEffect(() => {
        !localStorage.getItem("user") && navigate("/");
    }, []);

    return (
        <MissionWrap>
            <NaverMap latitude={35.87772056157816} longitude={128.6110784825801} isCreateWaypoint={isCrateWaypoint} />
            {isCreateMission && <CreateMission closeCreateMission={toggleCreateMission} submitCreateMission={submitCreateMission} selectMission={selectMission} setSelectMission={setSelectMission}/>}
            {selectMission && <span className="mission_type">타입: {selectMission}</span>}

            <Button text="생성" onClick={toggleCreateMission} type="button" className="create_mission" />
        </MissionWrap>
    )
};