import { useEffect, useRef, useState } from 'react'
import { Mission } from '../mission/Mission'
import { ActiveType } from '../../constant/type'
import { useNavigate } from 'react-router-dom'
import { MainWrap } from './MainStyle'
import { Header } from '../../components/Header'
import { Station } from '../station/Station'
import { Schedule } from '../schedule/Schedule'

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none)
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [isActive, setIsActive] = useState('')
    // const [mapType, setMapType] = useState<naver.maps.MapTypeId>(
    //     naver.maps.MapTypeId.NORMAL
    // )

    const mapElement = useRef(null)
    // const mapTypeChange = (mapType: naver.maps.MapTypeId) => {
    //     setMapType(mapType)
    //     map?.setMapTypeId(mapType)
    // }

    useEffect(() => {
        if (!mapElement.current || !naver) return

        const location = new naver.maps.LatLng(35.8774, 128.6107)
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: false,
            mapDataControl: false,
            scaleControl: false,
        }

        setMap(new naver.maps.Map(mapElement.current, mapOptions))
    }, [])

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
                isActive={isActive}
                setIsActive={setIsActive}
                toggleMission={() => toggleActive(ActiveType.mission)}
                toggleStation={() => toggleActive(ActiveType.station)}
                toggleSchedule={() => toggleActive(ActiveType.schedule)}
            />

            <div id="map" className="map" ref={mapElement}></div>

            {activeType === ActiveType.mission && (
                <Mission
                    setIsActive={setIsActive}
                    toggleMission={() => toggleActive(ActiveType.mission)}
                    map={map}
                />
            )}

            {activeType === ActiveType.station && (
                <Station
                    toggleStation={() => toggleActive(ActiveType.station)}
                />
            )}

            {activeType === ActiveType.schedule && (
                <Schedule
                    toggleSchedule={() => toggleActive(ActiveType.schedule)}
                />
            )}
        </MainWrap>
    )
}
