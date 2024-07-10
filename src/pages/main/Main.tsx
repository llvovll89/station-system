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
import { RunningSchedule } from './RunningSchedule'
import { getSchedule } from '../../util/requestHttp'
import axios from 'axios'
import DroneImage from '../../assets/image/icon/ico_airplane(w).png'
import { MapButton } from '../../components/MapButton'

export const Main = () => {
    const [activeType, setIsActiveType] = useState<ActiveType>(ActiveType.none)
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [stations, setStations] = useState<StationDto[]>([])
    const [isActive, setIsActive] = useState('')
    const [isRunningSchedule, setIsRunningSchedule] = useState(false)

    const dockMarkers = useRef<naver.maps.Marker[]>([])
    const droneMarkers = useRef<naver.maps.Marker[]>([])
    const mapElement = useRef(null)

    const waylines = useRef<naver.maps.Polyline | null>(null)
    const markers = useRef<naver.maps.Marker[]>([])
    const polygon = useRef<naver.maps.Polygon | null>(null)

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
        // getWeather()
    }, [])

    const navigate = useNavigate()

    const toggleActive = (type: ActiveType) => {
        setIsActiveType((prev) => (prev === type ? ActiveType.none : type))
    }

    const resetOverlay = () => {
        // 기존 폴리라인과 마커 삭제
        if (waylines.current) {
            waylines.current.setMap(null)
            waylines.current = null
        }

        if (polygon.current) {
            polygon.current.setMap(null)
            polygon.current = null
        }

        markers.current.forEach((marker) => marker.setMap(null))
        markers.current = []
    }

    const createWayline = (data: any) => {
        const path =
            data &&
            data.data.ways.map(
                (p: { latitude: number; longitude: number }) =>
                    new naver.maps.LatLng(p.latitude, p.longitude)
            )

        waylines.current = new naver.maps.Polyline({
            map: map ? map : undefined,
            path: path,
            strokeColor: '#2E8B57',
            strokeOpacity: 1,
            strokeWeight: 4,
            strokeStyle: 'solid',
        })

        const startPoint = path[0]
        const endPoint = path[path.length - 1]

        const startMarker = new naver.maps.Marker({
            position: startPoint,
            map: map ? map : undefined,
            icon: {
                content: '<div class="start_marker">S</div>',
                anchor: new naver.maps.Point(12, 12),
            },
        })

        markers.current.push(startMarker)

        const endMarker = new naver.maps.Marker({
            position: endPoint,
            map: map ? map : undefined,
            icon: {
                content: '<div class="end_marker">E</div>',
                anchor: new naver.maps.Point(12, 12),
            },
        })

        markers.current.push(endMarker)
    }

    const getStation = async () => {
        try {
            const response = await axios.get(STATION, { withCredentials: true })
            const data = await response.data

            if (response.status === 200) {
                setStations(data)

                clearMarkers(dockMarkers.current)
                clearMarkers(droneMarkers.current)

                data.forEach(
                    (station: {
                        latitude: number
                        longitude: number
                        status: number
                        drone: {
                            name: string
                            latitude: number
                            longitude: number
                        }
                    }) => {
                        const params = {
                            latitude: station.latitude,
                            longitude: station.longitude,
                            status: station.status,
                            drone: station.drone,
                        }

                        setDockMarker(params)
                    }
                )

                const hasRunning = data.some(
                    (station: StationDto) => station.status === 1
                )
                setIsRunningSchedule(hasRunning)
                hasRunning && getSchedule()

                if (hasRunning) {
                    const data = JSON.parse(
                        sessionStorage.getItem('missionInfo')!
                    )

                    resetOverlay()

                    if (data.data.type === 1) {
                        polygon.current = new naver.maps.Polygon({
                            map: map ? map : undefined,
                            paths: data.data.points.map(
                                (p: { latitude: number; longitude: number }) =>
                                    new naver.maps.LatLng(
                                        p.latitude,
                                        p.longitude
                                    )
                            ),
                            strokeColor: '#0080DE',
                            strokeOpacity: 1,
                            strokeWeight: 4,
                            fillColor: '#fefefe',
                            fillOpacity: 0.6,
                            strokeStyle: 'solid',
                        })

                        data.data.points.forEach(
                            (p: { latitude: number; longitude: number }) => {
                                const marker = new naver.maps.Marker({
                                    map: map ? map : undefined,
                                    position: new naver.maps.LatLng(
                                        p.latitude,
                                        p.longitude
                                    ),
                                    icon: {
                                        content: `<div class='waypoint_marker'></div>`,
                                        anchor: new naver.maps.Point(9, 9),
                                    },
                                })

                                markers.current.push(marker)
                            }
                        )
                    } else {
                        data.data.points.forEach(
                            (p: { latitude: number; longitude: number }) => {
                                const marker = new naver.maps.Marker({
                                    map: map ? map : undefined,
                                    position: new naver.maps.LatLng(
                                        p.latitude,
                                        p.longitude
                                    ),
                                    icon: {
                                        content: `<div class='waypoint_marker'></div>`,
                                        anchor: new naver.maps.Point(9, 9),
                                    },
                                })

                                markers.current.push(marker)
                            }
                        )
                    }

                    createWayline(data)
                } else {
                    resetOverlay()
                    sessionStorage.removeItem('missionInfo')
                    setIsRunningSchedule(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const setDockMarker = (params: {
        latitude: number
        longitude: number
        status: number
        drone: {
            name: string
            latitude: number
            longitude: number
        }
    }) => {
        const { latitude, longitude, status } = params

        if (status === 1) {
            const drone = new naver.maps.Marker({
                map: map ? map : undefined,
                position: new naver.maps.LatLng(
                    params.drone.latitude,
                    params.drone.longitude
                ),
                icon: {
                    content: `<div class='drone_marker'>
                        <img src=${DroneImage} alt='drone_image' />
                    </div>`,
                    anchor: new naver.maps.Point(16, 16),
                },
            })

            droneMarkers.current.push(drone)
        }

        const marker = new naver.maps.Marker({
            map: map ? map : undefined,
            position: new naver.maps.LatLng(latitude, longitude),
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
                    map={map}
                />
            )}

            {activeType === ActiveType.schedule && (
                <Schedule
                    isRunningSchedule={isRunningSchedule}
                    setIsActive={setIsActive}
                    stations={stations}
                    toggleSchedule={() => toggleActive(ActiveType.schedule)}
                />
            )}

            {isRunningSchedule && <RunningSchedule />}

            <DarkMode />
            <MapButton />
        </MainWrap>
    )
}
