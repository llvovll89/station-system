import { useEffect, useMemo, useState } from 'react'
import { NaverMap } from '../../components/navermap/Map'
import { Mission } from '../mission/Mission'
import { MissionDto } from '../../dto/MissionDto'
import { ActiveType, MissionType } from '../../constant/type'
import { useNavigate } from 'react-router-dom'
import { MainWrap } from './MainStyle'
import { MissionList } from '../mission/list/MissionList'
import { Header } from '../../components/Header'
import { StationList } from '../station/list/StationList'

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none)
    const [isCreateMission, setIsCreateMission] = useState(false)
    const [selectMission, setSelectMission] = useState<string | MissionType>('')
    const [isCreateStart, setIsCreateStart] = useState(false)
    const [missionData, setMissionData] = useState<MissionDto>({
        seq: 0,
        name: '',
        type: 0,
        mainPoint: { latitude: 0, longitude: 0 },
        transverseRedundancy: 0,
        longitudinalRedundancy: 0,
        points: [],
        angle: 70,
        createdAt: '',
        updatedAt: '',
    })

    const navigate = useNavigate()

    const toggleActive = (type: ActiveType) => {
        setIsActiveType((prev) => (prev === type ? ActiveType.none : type))
    }

    const naverMapProps = useMemo(
        () => ({
            latitude: 35.87772056157816,
            longitude: 128.6110784825801,
            missionData,
            isCreateMission,
            isCreateStart,
            selectMission,
            setIsCreateStart,
            setSelectMission,
        }),
        [missionData, isCreateStart, selectMission]
    )

    const missionProps = () => ({
        isCreateMission,
        setIsCreateMission,
        setIsCreateStart,
        setSelectMission,
        setMissionData,
        missionData,
        isCreateStart,
        selectMission,
    })

    useEffect(() => {
        !localStorage.getItem('user') && navigate('/')
    }, [])

    return (
        <MainWrap>
            <Header
                toggleMission={() => toggleActive(ActiveType.mission)}
                toggleStation={() => toggleActive(ActiveType.station)}
            />

            <NaverMap {...naverMapProps} />
            <Mission {...missionProps()} />

            {activeType === ActiveType.mission && (
                <MissionList
                    toggleMission={() => toggleActive(ActiveType.mission)}
                />
            )}
            {activeType === ActiveType.station && (
                <StationList
                    toggleStation={() => toggleActive(ActiveType.station)}
                />
            )}
        </MainWrap>
    )
}
