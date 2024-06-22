import { MissionWrap } from './MissionStyle'
import { Button } from '../../components/button/Button'
import { AreaOptions, MissionStateItem } from '../../constant/type'
import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { GrPowerReset } from 'react-icons/gr'
import { WaypPointMission } from './weapoint/WayPointMission'
import { GridMission } from './grid/GridMission'
import { MissionList } from './list/MissionList'
import { useState } from 'react'

interface MissionProps {
    toggleMission: () => void
    map: naver.maps.Map | null
}

export const Mission = ({ toggleMission, map }: MissionProps) => {
    const [isCreateMission, setIsCreateMission] = useState(false)
    const [missionType, setMissionType] = useState<null | number>(null)
    const [activeMission, setActiveMission] = useState<
        null | 'waypoint' | 'grid'
    >(null)
    const [missionState, setMissionState] = useState<MissionStateItem>({
        mainPoints: [],
        distance: 0,
        areaSize: 0,
    })
    const [areaOptions, setAreaOptions] = useState<AreaOptions>({
        droneAltitude: 100,
        speed: 5,
        angle: 45,
        droneAngle: 45,
        horizontalRedundancy: 70,
        verticalRedundancy: 70,
        photoWidthRatio: 4,
        photoHeightRatio: 3,
    })

    const setCreateMission = () => {
        setIsCreateMission((prev) => !prev)
        setActiveMission(null)
    }

    const selectMissionType = (type: number) => {
        setMissionType(type)
    }

    const resetMap = () => {
        map?.refresh(true)
    }

    const resetMission = () => {
        // setIsCreateMission(false)
        // setMissionType(null)
        // setActiveMission(null)
        // setMissionState({
        //     mainPoints: [],
        //     distance: 0,
        //     areaSize: 0,
        // })
        // setAreaOptions({
        //     droneAltitude: 100,
        //     speed: 5,
        //     angle: 45,
        //     droneAngle: 45,
        //     horizontalRedundancy: 70,
        //     verticalRedundancy: 70,
        //     photoWidthRatio: 4,
        //     photoHeightRatio: 3,
        // })
    }

    return (
        <MissionWrap>
            <MissionList toggleMission={toggleMission} />

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
                        missionState={missionState}
                        activeMission={activeMission}
                        setActiveMission={setActiveMission}
                        setMissionState={setMissionState}
                    />

                    <GridMission
                        map={map}
                        missionState={missionState}
                        setAreaOptions={setAreaOptions}
                        areaOptions={areaOptions}
                        activeMission={activeMission}
                        setMissionState={setMissionState}
                    />

                    <Button
                        className="init_btn"
                        type="button"
                        onClick={resetMap}
                    >
                        <GrPowerReset />
                        <span>INIT</span>
                    </Button>
                </>
            )}
        </MissionWrap>
    )
}
