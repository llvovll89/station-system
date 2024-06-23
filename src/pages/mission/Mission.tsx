import { MissionWrap } from './MissionStyle'
import { Button } from '../../components/button/Button'
import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { GrPowerReset } from 'react-icons/gr'
import { WaypPointMission } from './weapoint/WayPointMission'
import { GridMission } from './grid/GridMission'
import { MissionList } from './list/MissionList'
import { useState } from 'react'
import { MissionDto } from '../../dto/MissionDto'

interface MissionProps {
    toggleMission: () => void
    map: naver.maps.Map | null
}

export const Mission = ({ toggleMission, map }: MissionProps) => {
    const [isCreateMission, setIsCreateMission] = useState(false)
    const [isCreate, setIsCreate] = useState(false)
    const [missionData, setMissionData] = useState<MissionDto>({
        name: '',
        type: 0,
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
        setIsCreateMission((prev) => !prev)
        setActiveMission(null)
    }

    const resetMission = () => {
        setMissionData({
            name: '',
            type: 0,
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
        setActiveMission(null)
        location.reload()
    }

    return (
        <MissionWrap>
            <MissionList toggleMission={toggleMission} isCreate={isCreate} />

            <Button
                className="create_btn"
                type="button"
                onClick={setCreateMission}
            >
                <VscGitPullRequestCreate />
                <span>생성</span>
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
                    />

                    <GridMission
                        map={map}
                        activeMission={activeMission}
                        setActiveMission={setActiveMission}
                        setMissionData={setMissionData}
                        missionData={missionData}
                        setIsCreate={setIsCreate}
                    />

                    <Button
                        className="init_btn"
                        type="button"
                        onClick={resetMission}
                    >
                        <GrPowerReset />
                        <span>INIT</span>
                    </Button>
                </>
            )}
        </MissionWrap>
    )
}
