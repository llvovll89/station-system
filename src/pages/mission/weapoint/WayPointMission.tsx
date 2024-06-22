import { useEffect, useState } from 'react'
import { MissionStateItem, OverlayType } from '../../../constant/type'
import { Button } from '../../../components/button/Button'
import { VscActivateBreakpoints } from 'react-icons/vsc'
import { WaypointWrap } from './WayPointMissionStyle'

interface WaypPointMissionProps {
    map: naver.maps.Map | null
    missionState: MissionStateItem
    activeMission: null | 'waypoint' | 'grid'
    setMissionState: React.Dispatch<React.SetStateAction<MissionStateItem>>
    setActiveMission: React.Dispatch<
        React.SetStateAction<null | 'waypoint' | 'grid'>
    >
}

export const WaypPointMission = ({
    map,
    missionState,
    activeMission,
    setMissionState,
    setActiveMission,
}: WaypPointMissionProps) => {
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
    const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null)
    const [wayLines, setWayLines] = useState<naver.maps.LatLng[]>([])
    const [isStartWaypoint, setIsStartWaypoint] = useState(false)
    const [distance, setDistance] = useState(0)

    const mainPointMarker: naver.maps.Marker[] = []
    const mainPoint: naver.maps.LatLng[] = []
    const guideLine = new naver.maps.Polyline({
        map,
        path: [],
        strokeColor: '#ff005e',
        strokeWeight: 4,
        strokeStyle: [4, 4],
        strokeOpacity: 0.7,
    })

    const wayLine = new naver.maps.Polyline({
        map,
        path: [],
        strokeColor: '#0CF395',
        strokeOpacity: 1,
        strokeWeight: 5,
    })

    const resetData = () => {
        setMarkers((m) => {
            return m.map((marker) => {
                marker.setMap(null)
                return marker
            })
        })

        setMarkers([])
        setMainPoints([])
        setWayLines([])
        setDistance(0)
    }

    const createWayPointMission = () => {
        if (isStartWaypoint) {
            alert('미션이 진행 중 입니다.')
        } else {
            setActiveMission('waypoint')

            const markerArr: naver.maps.Marker[] = [],
                mainPointsArr: naver.maps.LatLng[] = []
            const setWayPoint = naver.maps.Event.addListener(
                map,
                'click',
                (e: { coord: naver.maps.LatLng }) => {
                    setIsStartWaypoint(true)
                    const path = wayLine?.getPath() as naver.maps.ArrayOfCoords
                    path.push(e.coord)
                    setPolyline(wayLine)
                    setMainPoints((prev) => [...prev, e.coord])
                    setWayLines((prev) => [...prev, e.coord])
                    mainPoints.push(e.coord)

                    setMissionState((prev) => ({
                        ...prev,
                        mainPoints: [
                            ...missionState.mainPoints,
                            ...mainPointsArr,
                        ],
                    }))

                    const marker = new naver.maps.Marker({
                        map,
                        position: e.coord,
                        draggable: true,
                        icon: {
                            content: `<div class='wayline_marker'>${mainPoints.length}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    })

                    markerArr.push(marker)
                    mainPointMarker.push(marker)
                    setMarkers((prev) => [...prev, marker])
                    dragResize(markerArr, marker)
                    setDistance(wayLine.getDistance())
                    deletePoint(marker)

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
                                setMissionState((prev) => ({
                                    ...prev,
                                    distance: wayLine.getDistance(),
                                }))

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

    const deletePoint = (marker: naver.maps.Marker) => {
        naver.maps.Event.addListener(marker, 'rightclick', (e) => {
            const deleteMarker = new naver.maps.Marker({
                map,
                position: e.coord,
                icon: {
                    content: `<div class='delete_marker'>delete</div>`,
                    anchor: new naver.maps.Point(12, 12),
                },
            })

            naver.maps.Event.addListener(deleteMarker, 'click', () => {
                console.log('delete')
                // const index = markers.indexOf(marker)
                // if (index !== -1) {
                //     markers[index].setMap(null)
                //     markers.splice(index, 1)
                //     mainPointMarker[index].setMap(null)
                //     mainPointMarker.splice(index, 1)
                //     mainPoints.splice(index, 1)
                //     wayLines.splice(index, 1)
                // }
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
            }
        )
    }

    const submitWaypoint = () => {
        // http response 받은 후
        // setIsStartWaypoint(false)
    }

    useEffect(() => {
        resetData()
    }, [])

    return (
        <>
            <WaypointWrap isStartWaypoint={isStartWaypoint}>
                <Button
                    onClick={createWayPointMission}
                    type="button"
                    disabled={activeMission === 'grid'}
                >
                    <VscActivateBreakpoints />
                    <span>Way</span>
                </Button>
            </WaypointWrap>

            {isStartWaypoint && (
                <div className="waypoint_content">
                    <div className="content">
                        <span>포인트 갯수: {mainPoints.length}</span>
                        <span>총 거리: {distance.toFixed(2)}m</span>
                    </div>
                    <div className="btn_box">
                        <Button
                            onClick={submitWaypoint}
                            type="button"
                            className="submit_btn"
                        >
                            <span>추가하기</span>
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
            )}
        </>
    )
}
