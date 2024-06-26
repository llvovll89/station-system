import { useEffect, useRef, useState } from 'react'
import { Mission } from '../mission/Mission'
import { ActiveType } from '../../constant/type'
import { useNavigate } from 'react-router-dom'
import { MainWrap } from './MainStyle'
import { Header } from '../../components/Header'
import { Station } from '../station/Station'
import { Schedule } from '../schedule/Schedule'
import axios from 'axios'
import { StationDto } from '../../dto/Station'
import { STATION } from '../../constant/http'

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none)
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [station, setStation] = useState<StationDto>()
    const [isActive, setIsActive] = useState('')
    let dockMarker = useRef<naver.maps.Marker | null>(null).current
    let droneMarker = useRef<naver.maps.Marker | null>(null).current

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

    const getStation = async () => {
        try {
            const response = await axios.get(STATION, { withCredentials: true })
            const data = await response.data

            if (response.status === 200) {
                setStation(data[0])
                console.log('data[0]:', data[0])
                console.log('station:', station)

                const params = {
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    status: data[0].status,
                }

                setDockMarker(params)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const setDockMarker = (params: {
        latitude: number
        longitude: number
        status: number
    }) => {
        const { latitude, longitude, status } = params
        if (dockMarker) {
            dockMarker.setMap(null)
        }

        if (status === 1) {
            if (droneMarker) {
                droneMarker.setMap(null)
            }

            const drone = new naver.maps.Marker({
                map: map ? map : undefined,
                position: new naver.maps.LatLng(latitude, longitude),
                animation: naver.maps.Animation.BOUNCE,
                icon: {
                    content: `<div class='drone_marker'><span>🛸</span></div>`,
                    anchor: new naver.maps.Point(16, 16),
                },
            })

            droneMarker = drone
        }

        const marker = new naver.maps.Marker({
            map: map ? map : undefined,
            position: new naver.maps.LatLng(latitude, longitude),
            animation: naver.maps.Animation.BOUNCE,
            icon: {
                content: `<div class='dock_marker'><span>🚍</span></div>`,
                anchor: new naver.maps.Point(18, 18),
            },
        })

        dockMarker = marker
        console.log('params:', params)
        console.log('dockMarker:', dockMarker)
        console.log(marker)
    }

    useEffect(() => {
        !localStorage.getItem('user') && navigate('/')
    }, [])

    useEffect(() => {
        if (!map) return

        const httpRequestInterval = setInterval(() => {
            getStation()
        }, 2000)

        return () => clearInterval(httpRequestInterval)
    }, [map])

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
