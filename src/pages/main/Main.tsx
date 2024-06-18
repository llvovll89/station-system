import { useEffect, useMemo, useState } from 'react'
// import { NaverMap } from '../../components/navermap/Map'
import { Map, NaverMap } from '../../components/navermap/NaverMap'
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

    const navigate = useNavigate()

    const toggleActive = (type: ActiveType) => {
        setIsActiveType((prev) => (prev === type ? ActiveType.none : type))
    }

    useEffect(() => {
        !localStorage.getItem('user') && navigate('/')
    }, [])

    return (
        <MainWrap>
            <Header
                toggleMission={() => toggleActive(ActiveType.mission)}
                toggleStation={() => toggleActive(ActiveType.station)}
            />

            <Map />

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
