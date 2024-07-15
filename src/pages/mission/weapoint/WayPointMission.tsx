import { useEffect, useState } from 'react'
import { Button } from '../../../components/button/Button'
import { MISSION } from '../../../constant/http'
import { MissionDto } from '../../../dto/MissionDto'
import axios from 'axios'

interface WaypPointMissionProps {
    map: naver.maps.Map | null
    setIsRunningMission: React.Dispatch<
        React.SetStateAction<{
            waypoint: boolean
            grid: boolean
            isStart: boolean
        }>
    >
    isRunningMission: {
        waypoint: boolean
        grid: boolean
        isStart: boolean
    }
    missionData: MissionDto
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
    setIsCreateMission: React.Dispatch<React.SetStateAction<boolean>>
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>
}

export const WaypPointMission = ({
    map,
    missionData,
    isRunningMission,
    setIsRunningMission,
    setIsHttpRequest,
    setMissionData,
}: WaypPointMissionProps) => {
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
    const [wayLines, setWayLines] = useState<naver.maps.LatLng[]>([])
    const [wayPointState, setWayPointState] = useState({
        overlay: null as naver.maps.Polyline | null,
        markers: [] as naver.maps.Marker[],
    })
    const [distance, setDistance] = useState(0)

    const mainPointMarker: naver.maps.Marker[] = []
    const guideLine = new naver.maps.Polyline({
        map: map ? map : undefined,
        path: [],
        strokeColor: '#ff005e',
        strokeWeight: 4,
        strokeStyle: [4, 4],
        strokeOpacity: 0.7,
    })

    const wayLine = new naver.maps.Polyline({
        map: map ? map : undefined,
        path: [],
        strokeColor: '#0CF395',
        strokeOpacity: 1,
        strokeWeight: 5,
    })

    const resetData = () => {
        wayPointState.markers.forEach((marker) => marker.setMap(null))
        wayPointState.overlay && wayPointState.overlay.setMap(null)

        setWayPointState({
            overlay: null,
            markers: [],
        })

        setMainPoints([])
        setWayLines([])
        setDistance(0)
    }

    const createWayPointMission = () => {
        if (isRunningMission.waypoint) {
            setMissionData({
                ...missionData,
                type: 0,
            })
            const markerArr: naver.maps.Marker[] = []
            const setWayPoint = naver.maps.Event.addListener(
                map,
                'click',
                (e: { coord: naver.maps.LatLng }) => {
                    const path = wayLine?.getPath() as naver.maps.ArrayOfCoords
                    path.push(e.coord)
                    setMainPoints((prev) => [...prev, e.coord])
                    setWayLines((prev) => [...prev, e.coord])
                    mainPoints.push(e.coord)

                    setMissionData((prev) => ({
                        ...prev,
                        mainPoint: {
                            latitude: e.coord.lat(),
                            longitude: e.coord.lng(),
                            height: 100,
                        },
                        points: [
                            ...prev.points,
                            {
                                latitude: e.coord.lat(),
                                longitude: e.coord.lng(),
                                height: 100,
                            },
                        ],
                        ways: [
                            ...prev.ways,
                            {
                                latitude: e.coord.lat(),
                                longitude: e.coord.lng(),
                                height: 100,
                            },
                        ],
                    }))

                    const marker = new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: e.coord,
                        draggable: true,
                        icon: {
                            content: `<div class='wayline_marker'>${mainPoints.length}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    })

                    markerArr.push(marker)
                    setWayPointState((prevState) => ({
                        ...prevState,
                        markers: [...prevState.markers, marker],
                        overlay: wayLine,
                    }))
                    mainPointMarker.push(marker)
                    dragResize(markerArr, marker)
                    setDistance(wayLine.getDistance())
                    deletePoint(marker, markerArr)

                    const createGuideLine = naver.maps.Event.addListener(
                        map,
                        'mousemove',
                        (e: { coord: naver.maps.LatLng }) => {
                            const lastLatLng =
                                mainPointMarker[
                                    mainPointMarker.length - 1
                                ].getPosition()
                            guideLine.setPath([lastLatLng, e.coord])
                        }
                    )

                    const endWayPointMission = naver.maps.Event.addListener(
                        markerArr[markerArr.length - 1],
                        'click',
                        () => {
                            if (mainPoints.length > 0) {
                                guideLine?.setMap(null)

                                naver.maps.Event.removeListener(
                                    endWayPointMission
                                )
                                naver.maps.Event.removeListener(setWayPoint)
                                naver.maps.Event.removeListener(createGuideLine)
                            }
                        }
                    )
                }
            )
        }
    }

    const deletePoint = (
        marker: naver.maps.Marker,
        markerArr: naver.maps.Marker[]
    ) => {
        naver.maps.Event.addListener(marker, 'rightclick', (e) => {
            const deleteMarker = new naver.maps.Marker({
                map: map ? map : undefined,
                position: e.coord,
                icon: {
                    content: `<div class='delete_marker'>delete</div>`,
                    anchor: new naver.maps.Point(0, 40),
                },
            })

            naver.maps.Event.addListener(deleteMarker, 'click', () => {
                deleteMarker.setMap(null)
                const index = markerArr.indexOf(marker)

                if (index !== -1) {
                    marker.setMap(null)
                    markerArr.splice(index, 1)
                    mainPoints.splice(index, 1)
                    wayLines.splice(index, 1)
                    wayLine.setPath(mainPoints)
                    setDistance(wayLine.getDistance())

                    markerArr.forEach((marker, i) => {
                        marker.setIcon({
                            content: `<div class='wayline_marker'>${i + 1}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        })
                    })

                    setMissionData((prev) => ({
                        ...prev,
                        points: prev.points.filter((_, i) => i !== index),
                        ways: prev.ways.filter((_, i) => i !== index),
                    }))

                    setWayPointState((prev) => ({
                        ...prev,
                        markers: prev.markers.filter((_, i) => i !== index),
                    }))
                }
            })
        })
    }

    const dragResize = (
        markersArr: naver.maps.Marker[],
        marker: naver.maps.Marker
    ) => {
        const resizeEvent = naver.maps.Event.addListener(
            marker,
            'drag',
            (e: { coord: naver.maps.LatLng }) => {
                const index = markersArr.indexOf(marker)
                if (index !== -1) {
                    mainPoints[index] = e.coord
                    wayLine.setPath(mainPoints)
                    setDistance(wayLine.getDistance())
                }

                console.log(resizeEvent)
            }
        )
    }

    const submitWaypoint = async () => {
        if (
            missionData.name &&
            missionData.ways.length > 0 &&
            missionData.points.length > 0
        ) {
            try {
                const response = await axios.post(MISSION, missionData, {
                    withCredentials: true,
                })
                const data = await response.data
                console.log(data)

                resetData()
                setIsHttpRequest((prev) => (prev = !prev))
                setIsRunningMission((prevMission) => ({
                    ...prevMission,
                    waypoint: false,
                    isStart: false,
                }))

                alert('웨이포인트 미션 생성 완료!')
            } catch (err) {
                console.log(err)
            }
        } else {
            alert('모든 정보를 입력해주세요.')
        }
    }

    useEffect(() => {
        resetData()
    }, [])

    useEffect(() => {
        createWayPointMission()
    }, [])

    return (
        <>
            {isRunningMission.waypoint && (
                <div className="waypoint_content">
                    <div className="content">
                        <div className="overlay_info">
                            <span>
                                웨이포인트: {wayPointState.markers.length}
                            </span>
                            <span>총 거리: {distance.toFixed(2)}m</span>
                        </div>

                        <div className="btn_box">
                            <Button
                                onClick={resetData}
                                type="button"
                                className="submit_btn"
                            >
                                <span>초기화</span>
                            </Button>
                            <Button
                                onClick={submitWaypoint}
                                type="button"
                                className="submit_btn"
                            >
                                <span>생성</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
