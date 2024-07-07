import { MissionWrap } from './MissionStyle'
import { Button } from '../../components/button/Button'
import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { WaypPointMission } from './weapoint/WayPointMission'
import { GridMission } from './grid/GridMission'
import { MissionList } from './list/MissionList'
import { useState } from 'react'
import { MissionDto } from '../../dto/MissionDto'

interface MissionProps {
    toggleMission: () => void
    map: naver.maps.Map | null
    setIsActive: React.Dispatch<React.SetStateAction<string>>
}

export const Mission = ({ toggleMission, map, setIsActive }: MissionProps) => {
    const [isCreateMission, setIsCreateMission] = useState(false)
    const [isRunningMission, setIsRunningMission] = useState(false)
    const [isCreate, setIsCreate] = useState(false)
    const [missionData, setMissionData] = useState<MissionDto>({
        name: '',
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
    })
    const [activeMission, setActiveMission] = useState<
        null | 'waypoint' | 'grid'
    >(null)

    const setCreateMission = () => {
        if (isCreateMission) {
            setIsRunningMission(false)
        }

        setIsCreateMission((prev) => !prev)
        setActiveMission(null)
    }

    return (
        <MissionWrap>
            <MissionList
                toggleMission={toggleMission}
                isCreateMission={isCreateMission}
                isCreate={isCreate}
                isRunningMission={isRunningMission}
                map={map}
                setIsActive={setIsActive}
            />

            <Button
                className="create_btn"
                type="button"
                onClick={setCreateMission}
            >
                <VscGitPullRequestCreate />
                <span className={isCreateMission ? 'active' : ''}>
                    {isCreateMission ? '실행중' : '생성'}
                </span>
            </Button>

            {isCreateMission && (
                <>
                    <WaypPointMission
                        map={map}
                        activeMission={activeMission}
                        setActiveMission={setActiveMission}
                        setMissionData={setMissionData}
                        missionData={missionData}
                        setIsCreate={setIsCreate}
                        setIsRunningMission={setIsRunningMission}
                    />

                    <GridMission
                        map={map}
                        activeMission={activeMission}
                        setActiveMission={setActiveMission}
                        setMissionData={setMissionData}
                        missionData={missionData}
                        setIsCreate={setIsCreate}
                        setIsRunningMission={setIsRunningMission}
                    />
                </>
            )}
        </MissionWrap>
    )
}
