import { MissionWrap } from "./MissionStyle";
import { Button } from "../../components/button/Button";
import { CreateMissionWrap } from "./createmission/CreateMissionStyle";
import { MissionDto } from "../../dto/MissionDto";
import { MissionType } from "../../constant/type";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { AiOutlineReload } from "react-icons/ai";

interface MissionProps {
    isCreateMission: boolean;
    setIsCreateMission: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCreateStart: (value: boolean) => void;
    setSelectMission: React.Dispatch<React.SetStateAction<string | MissionType>>;
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>;
    missionData: MissionDto;
    selectMission: string | MissionType;
    initCreateMission: () => void;
}

export const Mission = ({ isCreateMission, setSelectMission, setMissionData, setIsCreateMission, setIsCreateStart, missionData, selectMission, initCreateMission }: MissionProps) => {
    const toggleCreateMission = () => {
        setSelectMission("");
        setMissionData((prev: MissionDto) => ({
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
        if (!missionData.name || !selectMission) {
            alert("빈 값 없이 선택해 주시기 바랍니다.")
        } else {
            setIsCreateStart(true);
            setIsCreateMission((prev) => !prev);
        }
    }

    return (
        <MissionWrap>
            {isCreateMission && (
                <CreateMissionWrap>
                    <article className="container">
                        <header>
                            <h1>미션생성</h1>
                            <Button type="button" text='X' onClick={toggleCreateMission} />
                        </header>

                        <div className="mission_name">
                            <label>미션 이름</label>
                            <input type="text" onChange={(e) => setMissionData({ ...missionData, name: e.target.value })} placeholder="mission name..." />
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

            <Button onClick={toggleCreateMission} type="button" className="create_mission">
                <VscGitPullRequestCreate />
            </Button>
            <Button onClick={initCreateMission} className="init_mission" type="button">
                <AiOutlineReload />
            </Button>
        </MissionWrap>
    )
};