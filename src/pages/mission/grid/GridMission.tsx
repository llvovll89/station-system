import { useState } from 'react'
import { AreaOptions } from '../../../constant/type'
import { Button } from '../../../components/button/Button'
import { TbAtom } from 'react-icons/tb'
import { GridMissionWrap } from './GridMissionStyle'
import {
    findMinMaxCoordinates,
    getDronePhotoWidth,
    haversineDistance,
    isPointInOverlayUtils,
} from '../../../util/missionUtils'
import { GridMissionOptions } from './GridMissionOptions'
import axios from 'axios'
import { MissionDto } from '../../../dto/MissionDto'
import { MISSION } from '../../../constant/http'

interface GridMissionProps {
    map: naver.maps.Map | null
    activeMission: null | 'waypoint' | 'grid'
    setActiveMission: React.Dispatch<
        React.SetStateAction<null | 'waypoint' | 'grid'>
    >
    missionData: MissionDto
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
    setIsCreate: React.Dispatch<React.SetStateAction<boolean>>
    setIsRunningMission: React.Dispatch<React.SetStateAction<boolean>>
}

export const GridMission = ({
    map,
    activeMission,
    setActiveMission,
    missionData,
    setMissionData,
    setIsCreate,
    setIsRunningMission,
}: GridMissionProps) => {
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
    const [overlays, setOverlays] = useState<{
        startMarker: naver.maps.Marker | null
        endMarker: naver.maps.Marker | null
        wayLine: naver.maps.Polyline | null
        overlay: naver.maps.Polygon
    }>({
        startMarker: null,
        endMarker: null,
        wayLine: null,
        overlay: new naver.maps.Polygon({
            map: map ? map : undefined,
            paths: [],
            strokeColor: '#0080DE',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillColor: '#fefefe',
            fillOpacity: 0.6,
            strokeStyle: 'solid',
        }),
    })
    const [areaOptions, setAreaOptions] = useState<AreaOptions>({
        droneAltitude: 100,
        speed: 5,
        angle: 45,
        droneAngle: 45,
        transverseRedundancy: 70,
        longitudinalRedundancy: 70,
        photoWidthRatio: 4,
        photoHeightRatio: 3,
    })

    const mainPointMarker: naver.maps.Marker[] = []
    const mainPoint: naver.maps.LatLng[] = []
    const polygon = new naver.maps.Polygon({
        map: map ? map : undefined,
        paths: [],
        strokeColor: '#0080DE',
        strokeOpacity: 1,
        strokeWeight: 4,
        fillColor: '#fefefe',
        fillOpacity: 0.6,
        strokeStyle: 'solid',
    })

    const guideLine = new naver.maps.Polyline({
        map: map ? map : undefined,
        path: [],
        strokeColor: '#0080DE',
        strokeWeight: 4,
        strokeStyle: [4, 4],
        strokeOpacity: 0.8,
    })

    const createGridMission = () => {
        if (map) {
            if (activeMission !== 'waypoint') {
                setIsRunningMission((prev) => !prev)
                setActiveMission('grid')

                const setGridMission = naver.maps.Event.addListener(
                    map,
                    'click',
                    (e: { coord: naver.maps.LatLng }) => {
                        mainPoint.push(e.coord)
                        setMainPoints((prev) => [...prev, e.coord])

                        setMissionData((prev) => ({
                            ...prev,
                            type: 1,
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
                        }))

                        const marker = new naver.maps.Marker({
                            map,
                            position: e.coord,
                            draggable: true,
                            clickable: true,
                            icon: {
                                content: `<div class='marker'>${mainPoint.length}</div>`,
                                anchor: new naver.maps.Point(12, 18.5),
                            },
                        })

                        mainPointMarker.push(marker)
                        setMarkers((prev) => [...prev, marker])
                        polygon.setPath(mainPoint)
                        polygonResize(marker, mainPointMarker)

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

                        if (mainPoint.length > 2) {
                            naver.maps.Event.addListener(
                                mainPointMarker[mainPointMarker.length - 1],
                                'click',
                                () => {
                                    createWays(polygon)

                                    naver.maps.Event.removeListener(
                                        setGridMission
                                    )
                                    naver.maps.Event.removeListener(
                                        createGuideLine
                                    )
                                    initSetOverlay()
                                    // calculateArea(mainPoint)
                                    // calculateDistances(mainPoint)
                                }
                            )
                        }
                    }
                )
            } else {
                alert('웨이포인트 미션이 실행 중 입니다.')
            }
        }
    }

    const initSetOverlay = () => {
        guideLine.setMap(null)
    }

    const polygonResize = (
        marker: naver.maps.Marker,
        mainPointMarker: naver.maps.Marker[]
    ) => {
        console.log(marker, mainPointMarker)

        // naver.maps.Event.addListener(
        //     marker,
        //     'drag',
        //     (e: { coord: naver.maps.LatLng }) => {
        //         const index = mainPointMarker.indexOf(marker)
        //         if (index !== -1) {
        //             mainPoints[index] = e.coord
        //             polygon.setPath(mainPoints)
        //         }
        //     }
        // )
    }

    const createWays = (polygon: naver.maps.Polygon) => {
        const wayLineItems: naver.maps.LatLng[] = []
        const path = polygon.getPath() as naver.maps.KVOArrayOfCoords

        const points = path.getArray().map((point: any) => ({
            latitude: point.lat(),
            longitude: point.lng(),
            height: 100,
        }))

        const minMaxPoints = findMinMaxCoordinates(points)
        const boundCenterPoint = new naver.maps.LatLng(
            (minMaxPoints[0].latitude + minMaxPoints[1].latitude) / 2,
            (minMaxPoints[0].longitude + minMaxPoints[1].longitude) / 2
        )

        const boundWidth = haversineDistance(
            minMaxPoints[0].latitude,
            minMaxPoints[0].longitude,
            minMaxPoints[0].latitude,
            minMaxPoints[1].longitude
        )
        const boundHeight = haversineDistance(
            minMaxPoints[0].latitude,
            minMaxPoints[0].longitude,
            minMaxPoints[1].latitude,
            minMaxPoints[0].longitude
        )
        const maxBoundWidth = Math.max(boundWidth, boundHeight) * 2

        // 북 동 남 서
        const topLeftPoint = boundCenterPoint
            .destinationPoint(Number(areaOptions.angle), maxBoundWidth / 2)
            .destinationPoint(
                270 + Number(areaOptions.angle),
                maxBoundWidth / 2
            )
        const topRightPoint = topLeftPoint.destinationPoint(
            90 + Number(areaOptions.angle),
            maxBoundWidth
        )
        const bottomRightPoint = topRightPoint.destinationPoint(
            180 + Number(areaOptions.angle),
            maxBoundWidth
        )
        const bottomLeftPoint = bottomRightPoint.destinationPoint(
            270 + Number(areaOptions.angle),
            maxBoundWidth
        )

        const newBound = new naver.maps.LatLngBounds(
            topLeftPoint,
            bottomRightPoint
        )
        newBound.extend(topLeftPoint)
        newBound.extend(topRightPoint)
        newBound.extend(bottomRightPoint)
        newBound.extend(bottomLeftPoint)

        const photoWidth = getDronePhotoWidth(areaOptions)
        const photoHeight = Math.floor(
            (photoWidth / areaOptions.photoWidthRatio) *
                areaOptions.photoHeightRatio
        )

        let widthPoint = topLeftPoint.destinationPoint(
            270 + Number(areaOptions.angle),
            photoWidth - (photoWidth * areaOptions.transverseRedundancy) / 100
        )
        const tempPoints = []
        let isReverse = false

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const nextPoint = widthPoint.destinationPoint(
                90 + Number(areaOptions.angle),
                photoWidth -
                    (photoWidth * areaOptions.transverseRedundancy) / 100
            )
            const distanceToStartPoint = haversineDistance(
                topLeftPoint.lat(),
                topLeftPoint.lng(),
                nextPoint.lat(),
                nextPoint.lng()
            )

            if (distanceToStartPoint > maxBoundWidth) {
                break
            }

            let underPoint = nextPoint
            const underPoints = []

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const nextUnderPoint = underPoint.destinationPoint(
                    180 + Number(areaOptions.angle),
                    photoHeight -
                        (photoHeight * areaOptions.longitudinalRedundancy) / 100
                )
                const distanceToWidthPoint = haversineDistance(
                    nextPoint.lat(),
                    nextPoint.lng(),
                    nextUnderPoint.lat(),
                    nextUnderPoint.lng()
                )

                if (distanceToWidthPoint > maxBoundWidth) {
                    break
                }

                if (isReverse) {
                    underPoints.splice(0, 0, underPoint)
                } else {
                    underPoints.push(underPoint)
                }

                underPoint = nextUnderPoint
            }

            if (isReverse) {
                tempPoints.push(...underPoints, nextPoint)
            } else {
                tempPoints.push(nextPoint, ...underPoints)
            }

            widthPoint = nextPoint
            isReverse = !isReverse
        }

        for (let i = 0; i < tempPoints.length; i++) {
            const point = {
                latitude: tempPoints[i].lat(),
                longitude: tempPoints[i].lng(),
                height: 100,
            }

            if (isPointInOverlayUtils(point, points)) {
                wayLineItems.push(tempPoints[i])
                const ways = {
                    latitude: tempPoints[i].lat(),
                    longitude: tempPoints[i].lng(),
                    height: 100,
                }

                setMissionData((prevData) => ({
                    ...prevData,
                    ways: [...prevData.ways, ways],
                }))
            }
        }

        setOverlay(wayLineItems)
        setOverlays((prev) => ({
            ...prev,
            overlay: polygon,
        }))
    }

    const setOverlay = (wayLineItems: naver.maps.LatLng[]) => {
        const newStartMarker = new naver.maps.Marker({
            map: map ? map : undefined,
            position: wayLineItems[0],
            icon: {
                content: `<div class='start_marker'>S</div>`,
                anchor: new naver.maps.Point(14, 14),
            },
        })

        const newEndMarker = new naver.maps.Marker({
            map: map ? map : undefined,
            position: wayLineItems[wayLineItems.length - 1],
            icon: {
                content: `<div class='end_marker'>E</div>`,
                anchor: new naver.maps.Point(14, 14),
            },
        })

        const newWayLine = new naver.maps.Polyline({
            map: map ? map : undefined,
            path: wayLineItems,
            strokeColor: '#0CF395',
            strokeOpacity: 1,
            strokeWeight: 5,
        })

        setOverlays({
            ...overlays,
            startMarker: newStartMarker,
            endMarker: newEndMarker,
            wayLine: newWayLine,
        })
    }

    const submitGridMission = async () => {
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

                setIsCreate((prev) => !prev)
                const isClose = confirm('생성이 완료 되었습니다')

                if (isClose) {
                    clearMap()
                } else {
                    clearMap()
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            alert('모든 정보를 입력해주세요.')
        }
    }

    const resetGridMission = () => {
        clearMap()
        setActiveMission(null)
        setMissionData({
            ...missionData,
            name: '',
            points: [],
            ways: [],
        })
        setOverlays({
            startMarker: null,
            endMarker: null,
            wayLine: null,
            overlay: new naver.maps.Polygon({
                map: map ? map : undefined,
                paths: [],
                strokeColor: '#0080DE',
                strokeOpacity: 1,
                strokeWeight: 4,
                fillColor: '#fefefe',
                fillOpacity: 0.6,
                strokeStyle: 'solid',
            }),
        })
        setMarkers([])
        setMainPoints([])
        console.log(mainPoints)
    }

    const clearMap = () => {
        markers.forEach((marker) => marker.setMap(null))
        if (polygon) polygon.setMap(null)
        if (guideLine) guideLine.setMap(null)
        if (overlays.wayLine) overlays.wayLine.setMap(null)
        if (overlays.startMarker) overlays.startMarker.setMap(null)
        if (overlays.endMarker) overlays.endMarker.setMap(null)
        if (overlays.overlay) overlays.overlay.setMap(null)

        // Reset state values
        setActiveMission(null)
        setMissionData({
            ...missionData,
            name: '',
            points: [],
            ways: [],
        })
        setOverlays({
            startMarker: null,
            endMarker: null,
            wayLine: null,
            overlay: new naver.maps.Polygon({
                map: map ? map : undefined,
                paths: [],
                strokeColor: '#0080DE',
                strokeOpacity: 1,
                strokeWeight: 4,
                fillColor: '#fefefe',
                fillOpacity: 0.6,
                strokeStyle: 'solid',
            }),
        })
        setMarkers([])
        setMainPoints([])
        console.log(mainPoints)
    }

    return (
        <>
            <GridMissionWrap
                className={activeMission !== 'grid' ? 'disabled' : ''}
            >
                <Button
                    type="button"
                    className={
                        activeMission === 'grid'
                            ? 'create_grid_mission active'
                            : 'create_grid_mission'
                    }
                    onClick={createGridMission}
                >
                    <TbAtom />
                    <span>Grid</span>
                </Button>
            </GridMissionWrap>

            {activeMission === 'grid' && (
                <GridMissionOptions
                    resetGridMission={resetGridMission}
                    areaOptions={areaOptions}
                    setAreaOptions={setAreaOptions}
                    setMissionData={setMissionData}
                    missionData={missionData}
                    // createWays={createWays={() => createWays(polygon)}}
                    submitGridMission={submitGridMission}
                />
            )}
        </>
    )
}
