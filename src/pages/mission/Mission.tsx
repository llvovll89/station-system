import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { NaverMap } from "../../components/navermap/Map";
import { Button } from "../../components/button/Button";
import { CreateMissionWrap } from "./createmission/CreateMissionStyle";
import { MissionDto } from "../../dto/MissionDto";
import { MissionType } from "../../constant/type";

export const Mission = () => {
    const [isCreateMission, setIsCreateMission] = useState(false);
    const [selectMission, setSelectMission] = useState<string | MissionType>("");
    const [isCreateStart, setIsCreateStart] = useState(false);
    const [missionData, setMissionData] = useState<MissionDto>({
        seq: 0,
        name: "",
        type: 0,
        mainPoint: {latitude: 0, longitude: 0},
        transverseRedundancy: 0,
        longitudinalRedundancy: 0,
        points: [],
        angle: 70,
        createdAt: "",
        updatedAt: ""
    });

    const navigate = useNavigate();

    const toggleCreateMission = () => {
        setSelectMission("");
        setMissionData((prev) => ({
            ...prev,
            name: "",
            type: 0,
        }))
        setIsCreateMission((prev) => !prev);
    };

    const selectMissionType = (type: string) => {
        setSelectMission((prev) => (prev === type ? "" : type));
    }

    const submitCreateMission = () => {
        if(!missionData.name || !selectMission) {
            alert("빈 값 없이 선택해 주시기 바랍니다.")
        } else {
            setIsCreateStart(true);   
            setIsCreateMission((prev) => !prev);
        }
    }

    useEffect(() => {
        !localStorage.getItem("user") && navigate("/");
    }, []);

    return (
        <MissionWrap>
            <NaverMap 
                latitude={35.87772056157816} 
                longitude={128.6110784825801} 
                missionData={missionData} 
                isCreateStart={isCreateStart} 
                selectMission={selectMission} 
                setIsCreateMission={setIsCreateMission} 
                setIsCreateStart={setIsCreateStart} 
                setSelectMission={setSelectMission} />
            
            {isCreateMission && (
                <CreateMissionWrap>
                    <article className="container">
                        <header>
                            <h1>미션생성</h1>
                            <Button type="button" text='X' onClick={toggleCreateMission} />
                        </header>

                        <div className="mission_name">
                            <label>미션 이름</label>
                            <input type="text" onChange={(e) => setMissionData({ ...missionData, name: e.target.value })} placeholder="mission name..."/>
                        </div>

                        <article className="grid">
                            <p>미션 타입</p>

                            <div className="grid">
                                <Button className={selectMission === 'wayline' ? 'wayline' : ''} onClick={() => selectMissionType("wayline")} type="button" text="웨이라인" />
                                <Button className={selectMission === 'region' ? 'region' : ''} onClick={() => selectMissionType("region")} type="button" text="지역" />
                            </div>
                        </article>

                        <footer>
                            <Button text="닫기" type="button" onClick={toggleCreateMission} />
                            <Button className={missionData.name && selectMission ? 'isSubmit' : ''} text="생성" type="button" onClick={submitCreateMission} />
                        </footer>
                    </article>
                </CreateMissionWrap>
            )}

            {missionData.name && <span className="mission_type">{missionData.name}</span>}
            <Button text="생성" onClick={toggleCreateMission} type="button" className="create_mission" />
        </MissionWrap>
    )
};