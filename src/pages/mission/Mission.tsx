import { MissionWrap } from "./MissionStyle";
// import { Button } from '../../components/button/Button'
// import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { WaypPointMission } from "./weapoint/WayPointMission";
import { GridMission } from "./grid/GridMission";
import { MissionList } from "./list/MissionList";
import { useState } from "react";
import { MissionDto } from "../../dto/MissionDto";
import { NewMission } from "./NewMission";
// import { MissionType } from '../../constant/type'

interface MissionProps {
    toggleMission: () => void;
    map: naver.maps.Map | null;
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
    isActive: string;
}

export const Mission = ({
    toggleMission,
    map,
    setIsActive,
    isActive,
}: MissionProps) => {
    const [isCreateMission, setIsCreateMission] = useState(false);
    const [isHttpRequest, setIsHttpRequest] = useState(false);
    const [isRunningMission, setIsRunningMission] = useState({
        waypoint: false,
        grid: false,
        isStart: false,
    });
    const [missionData, setMissionData] = useState<MissionDto>({
        name: "",
        type: 0,
        seq: 0,
        mainPoint: {
            latitude: 0,
            longitude: 0,
            height: 100,
        },
        points: [],
        ways: [],
        transverseRedundancy: 70,
        longitudinalRedundancy: 70,
        angle: 36,
    });

    const toggleCreateMission = () => {
        setIsCreateMission((prev) => !prev);
    };

    const initMissionData = () => {
        setMissionData({
            name: "",
            type: 0,
            seq: 0,
            mainPoint: {
                latitude: 0,
                longitude: 0,
                height: 100,
            },
            points: [],
            ways: [],
            transverseRedundancy: 70,
            longitudinalRedundancy: 70,
            angle: 36,
        });
    };

    // const [activeMission, setActiveMission] = useState<
    //     null | 'waypoint' | 'grid'
    // >(null)

    // const setCreateMission = () => {
    //     if (isCreateMission && activeMission !== null) {
    //         alert('미션 생성 또는 초기화 후 클릭해 주세요.')
    //         return
    //         // setIsRunningMission(false)
    //     }

    //     setIsCreateMission((prev) => !prev)
    //     // setActiveMission(null)
    // }

    return (
        <MissionWrap>
            <MissionList
                toggleMission={toggleMission}
                isCreateMission={isCreateMission}
                isRunningMission={isRunningMission}
                toggleCreateMission={toggleCreateMission}
                map={map}
                setIsHttpRequest={setIsHttpRequest}
                isHttpRequest={isHttpRequest}
                setIsActive={setIsActive}
                initMissionData={initMissionData}
                isActive={isActive}
            />

            {isCreateMission && (
                <NewMission
                    missionData={missionData}
                    isRunningMission={isRunningMission}
                    setIsCreateMission={setIsCreateMission}
                    setIsRunningMission={setIsRunningMission}
                    setMissionData={setMissionData}
                />
            )}

            {isRunningMission.waypoint && isRunningMission.isStart && (
                <WaypPointMission
                    map={map}
                    isRunningMission={isRunningMission}
                    setIsRunningMission={setIsRunningMission}
                    setMissionData={setMissionData}
                    missionData={missionData}
                    setIsHttpRequest={setIsHttpRequest}
                    setIsCreateMission={setIsCreateMission}
                    initMissionData={initMissionData}
                />
            )}

            {isRunningMission.grid && isRunningMission.isStart && (
                <GridMission
                    map={map}
                    isRunningMission={isRunningMission}
                    missionData={missionData}
                    setIsHttpRequest={setIsHttpRequest}
                    setIsRunningMission={setIsRunningMission}
                    setMissionData={setMissionData}
                    initMissionData={initMissionData}
                />
            )}
        </MissionWrap>
    );
};
