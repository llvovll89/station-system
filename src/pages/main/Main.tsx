import { useEffect, useRef, useState } from 'react'
import { Mission } from '../mission/Mission'
import { ActiveType } from '../../constant/type'
import { useNavigate } from 'react-router-dom'
import { MainWrap } from './MainStyle'
import { Header } from '../../components/Header'
import { Station } from '../station/Station'
import { Schedule } from '../schedule/Schedule'
import { StationDto } from '../../dto/Station'
import { STATION } from '../../constant/http'
import { DarkMode } from '../../components/Darkmode'
import axios from 'axios'

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none)
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [station, setStation] = useState<StationDto | null>(null)
    const [stations, setStations] = useState<StationDto[]>([])
    const [isActive, setIsActive] = useState('')

    const dockMarkers = useRef<naver.maps.Marker[]>([])
    const droneMarkers = useRef<naver.maps.Marker[]>([])

    const mapElement = useRef(null)

    const getWeather = async () => {
        try {
            // const response = await axios.get(
            //     `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_APIKEY}`
            // )
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=35.8774&lon=128.6107&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_APIKEY}`,
                {
                    withCredentials: true,
                }
            )
            const data = await response.data
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

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
        getWeather()
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
                setStations(data)
                setStation(data[0])
                console.log(stations)

                clearMarkers(dockMarkers.current)
                clearMarkers(droneMarkers.current)

                data.forEach(
                    (station: {
                        latitude: number
                        longitude: number
                        status: number
                    }) => {
                        const params = {
                            latitude: station.latitude,
                            longitude: station.longitude,
                            status: station.status,
                        }

                        setDockMarker(params)
                    }
                )
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

        if (status === 1) {
            const drone = new naver.maps.Marker({
                map: map ? map : undefined,
                position: new naver.maps.LatLng(latitude, longitude),
                animation: naver.maps.Animation.BOUNCE,
                icon: {
                    content: `<div class='drone_marker'><span>🛸</span></div>`,
                    anchor: new naver.maps.Point(16, 16),
                },
            })

            droneMarkers.current.push(drone)
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

        dockMarkers.current.push(marker)
    }

    const clearMarkers = (markers: naver.maps.Marker[]) => {
        markers.forEach((marker) => marker.setMap(null))
        markers.length = 0
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
                    setIsActive={setIsActive}
                />
            )}

            {activeType === ActiveType.schedule && (
                <Schedule
                    setIsActive={setIsActive}
                    station={station}
                    toggleSchedule={() => toggleActive(ActiveType.schedule)}
                />
            )}

            <DarkMode />
        </MainWrap>
    )
}
