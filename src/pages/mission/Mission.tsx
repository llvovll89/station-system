import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { NaverMap } from "../../components/navermap/Map";
import { Button } from "../../components/button/Button";
import { CreateMissionWrap } from "./createmission/CreateMissionStyle";

export const Mission = () => {
    const [isCreateMission, setIsCreateMission] = useState(false);
    const [selectMission, setSelectMission] = useState("");
    const [isCreateStart, setIsCreateStart] = useState(false);

    const navigate = useNavigate();

    const toggleCreateMission = () => {
        setIsCreateMission((prev) => !prev);
    };

    const selectMissionType = (type: string) => {
        setSelectMission(type);
    }

    const submitCreateMission = () => {
        toggleCreateMission();
        setIsCreateStart(true);
    }

    // const getMission = async () => {
    //     const response = await axios.get(MISSION);
    //     const data = response.data();
    //     console.log(data);
    // }

    useEffect(() => {
        !localStorage.getItem("user") && navigate("/");
    }, []);

    return (
        <MissionWrap>
            <NaverMap latitude={35.87772056157816} longitude={128.6110784825801} isCreateStart={isCreateStart} selectMission={selectMission} setIsCreateMission={setIsCreateMission} setIsCreateStart={setIsCreateStart} setSelectMission={setSelectMission} />
            {isCreateMission && (
                <CreateMissionWrap>
                    <article className="container">
                        <header>
                            <h1>미션생성</h1>
                            <Button type="button" text='X' onClick={toggleCreateMission} />
                        </header>

                        <article className="grid">
                            <p>미션 타입</p>

                            <div className="grid">
                                <Button className={selectMission === 'wayline' ? 'wayline' : ''} onClick={() => selectMissionType("wayline")} type="button" text="웨이라인" />
                                <Button className={selectMission === 'region' ? 'region' : ''} onClick={() => selectMissionType("region")} type="button" text="지역" />
                            </div>
                        </article>

                        <footer>
                            <Button text="닫기" type="button" onClick={toggleCreateMission} />
                            <Button text="생성" type="button" onClick={submitCreateMission} />
                        </footer>
                    </article>
                </CreateMissionWrap>
            )}
            {selectMission && <span className="mission_type">{selectMission}</span>}

            <Button text="생성" onClick={toggleCreateMission} type="button" className="create_mission" />
        </MissionWrap>
    )
};