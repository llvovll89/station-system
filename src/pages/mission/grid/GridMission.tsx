import { useEffect, useRef, useState } from 'react'
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
import { MissionDto } from '../../../dto/MissionDto'
import axios from 'axios'
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
    setIsCreateMission: React.Dispatch<React.SetStateAction<boolean>>
}

export const GridMission = ({
    map,
    activeMission,
    setActiveMission,
    missionData,
    setMissionData,
    setIsCreate,
    setIsCreateMission,
    setIsRunningMission,
}: GridMissionProps) => {
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
    const [areaSize, setAreaSize] = useState<string | null>(null)
    const [isOptions, setIsOptions] = useState(false)
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

    const wayLineRef = useRef<naver.maps.Polyline | null>(null)
    const guideLineRef = useRef<naver.maps.Polyline | null>(null)
    const mainPointsRef = useRef<naver.maps.Marker[]>([])
    const polygonRef = useRef<naver.maps.Polygon | null>(null)
    const dragMarkerRef = useRef<naver.maps.Marker | null>(null)
    const mainPointMarker: naver.maps.Marker[] = []
    const mainPoint: naver.maps.LatLng[] = []

    const clearMissionData = () => {
        setMissionData({
            name: '',
            type: 0,
            seq: 0,
            mainPoint: {
                latitude: 0,
                longitude: 0,
                height: 100,
            },
            points: [],
            ways: [],
            transverseRedundancy: 70,
            longitudinalRedundancy: 70,
            angle: 36,
        })
    }

    const createGridMission = () => {
        let gridMissionListener: any = null
        // guideLineListener: any = null

        polygonRef.current = new naver.maps.Polygon({
            map: map ? map : undefined,
            paths: [],
            strokeColor: '#0080DE',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillColor: '#fefefe',
            fillOpacity: 0.6,
            strokeStyle: 'solid',
        })

        if (map) {
            if (activeMission !== 'waypoint') {
                setIsRunningMission((prev) => !prev)
                setActiveMission('grid')

                gridMissionListener = naver.maps.Event.addListener(
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
                        polygonRef.current &&
                            polygonRef.current.setPath(mainPoint)
                        polygonResize(marker, mainPointMarker)

                        // guideLineListener = naver.maps.Event.addListener(
                        //     map,
                        //     'mousemove',
                        //     (e: { coord: naver.maps.LatLng }) => {
                        //         const lastLatLng =
                        //             mainPointMarker[
                        //                 mainPointMarker.length - 1
                        //             ].getPosition()

                        //         guideLineRef.current = new naver.maps.Polyline({
                        //             map: map ? map : undefined,
                        //             path: [lastLatLng, e.coord],
                        //             strokeColor: '#0080DE',
                        //             strokeWeight: 4,
                        //             strokeStyle: [4, 4],
                        //             strokeOpacity: 0.8,
                        //         })
                        //     }
                        // )

                        if (mainPoint.length > 2) {
                            naver.maps.Event.addListener(
                                mainPointMarker[mainPointMarker.length - 1],
                                'click',
                                () => {
                                    if (polygonRef.current) {
                                        createWays(polygonRef.current)
                                        calculateArea(
                                            polygonRef.current.getAreaSize()
                                        )
                                    }

                                    if (guideLineRef.current) {
                                        guideLineRef.current.setMap(null)
                                        guideLineRef.current = null
                                    }

                                    if (dragMarkerRef.current) {
                                        dragMarkerRef.current.setMap(null)
                                        dragMarkerRef.current = null
                                    }

                                    naver.maps.Event.removeListener(
                                        gridMissionListener
                                    )

                                    setIsOptions((prev) => !prev)

                                    // setDragPolygon()
                                    // naver.maps.Event.removeListener(
                                    //     guideLineListener
                                    // )
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

    const calculateArea = (areaSize: number) => {
        const squarKm = 1000000

        if (areaSize >= squarKm) {
            setAreaSize(parseFloat((areaSize / squarKm).toFixed(1)) + ' km²')
        } else {
            setAreaSize(
                parseFloat(areaSize.toFixed(1)).toLocaleString() + ' m²'
            )
        }
    }

    // const setDragPolygon = () => {
    //     const bounds =
    //         polygonRef.current?.getBounds() as naver.maps.LatLngBounds
    //     const ne = bounds?.getNE()
    //     const sw = bounds?.getSW()

    //     const se = new naver.maps.LatLng(sw.lat(), ne.lng())

    //     const bottom = new naver.maps.LatLng(
    //         (sw.lat() + se.lat()) / 2,
    //         (sw.lng() + se.lng()) / 2
    //     )

    //     dragMarkerRef.current = new naver.maps.Marker({
    //         map: map ? map : undefined,
    //         position: bottom,
    //         clickable: true,
    //         icon: {
    //             content: `<div class='edit_marker'>⚔️</div>`,
    //             anchor: new naver.maps.Point(16, 0),
    //         },
    //     })
    // }

    const polygonResize = (
        marker: naver.maps.Marker,
        mainPointMarker: naver.maps.Marker[]
    ) => {
        naver.maps.Event.addListener(
            marker,
            'drag',
            (e: { coord: naver.maps.LatLng }) => {
                if (wayLineRef.current) {
                    wayLineRef.current.setMap(null)
                    wayLineRef.current = null
                }

                if (mainPointsRef.current.length > 0) {
                    mainPointsRef.current.forEach((m) => m.setMap(null))
                    mainPointsRef.current = []
                }

                const newPosition = e.coord
                const markerIndex = mainPointMarker.indexOf(marker)
                mainPoint[markerIndex] = newPosition

                polygonRef.current && polygonRef.current.setPath(mainPoint)

                const newPoints = mainPoint.map((point) => ({
                    latitude: point.lat(),
                    longitude: point.lng(),
                    height: 100,
                }))

                setMissionData((prev) => ({
                    ...prev,
                    points: newPoints,
                }))
            }
        )

        naver.maps.Event.addListener(marker, 'dragend', () => {
            if (polygonRef.current) {
                clearWaylines()
                createWays(polygonRef.current)
            }
        })
    }

    const clearWaylines = () => {
        if (wayLineRef.current) {
            wayLineRef.current.setMap(null)
            wayLineRef.current = null
        }

        if (mainPointsRef.current.length > 0) {
            mainPointsRef.current.forEach((m) => m.setMap(null))
            mainPointsRef.current = []
        }
    }

    const createWays = (polygon: naver.maps.Polygon) => {
        // clearMissionData()
        setMissionData((prevData) => ({
            ...prevData,
            ways: [],
        }))
        clearWaylines()

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
    }

    const setOverlay = (wayLineItems: naver.maps.LatLng[]) => {
        if (wayLineRef.current) {
            wayLineRef.current.setMap(null)
            wayLineRef.current = null
        }

        if (mainPointsRef.current) {
            mainPointsRef.current.forEach((m) => m.setMap(null))
            mainPointsRef.current = []
        }

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

        wayLineRef.current = new naver.maps.Polyline({
            map: map ? map : undefined,
            path: wayLineItems,
            strokeColor: '#0CF395',
            strokeOpacity: 1,
            strokeWeight: 5,
        })

        mainPointsRef.current.push(newStartMarker)
        mainPointsRef.current.push(newEndMarker)
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

                setIsRunningMission((prev) => !prev)
                setIsCreateMission((prev) => !prev)
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
        clearMissionData()
        setMarkers([])
        setMainPoints([])
        setAreaSize(null)
        setIsRunningMission((prev) => !prev)
        setIsCreateMission((prev) => !prev)

        if (wayLineRef.current) {
            wayLineRef.current.setMap(null)
            wayLineRef.current = null
        }

        if (guideLineRef.current) {
            guideLineRef.current.setMap(null)
            guideLineRef.current = null
        }
    }

    const clearMap = () => {
        markers.forEach((marker) => marker.setMap(null))
        if (polygonRef.current) polygonRef.current.setMap(null)
        if (wayLineRef.current) wayLineRef.current.setMap(null)
        if (mainPointsRef.current.length > 0) {
            mainPointsRef.current.forEach((m) => m.setMap(null))
            mainPointsRef.current = []
        }

        // Reset state values
        polygonRef.current = null
        setActiveMission(null)
        setMissionData({
            ...missionData,
            name: '',
            points: [],
            ways: [],
        })
        setMarkers([])
        setMainPoints([])
        console.log(mainPoints)
    }

    useEffect(() => {
        if (polygonRef.current) createWays(polygonRef.current)
    }, [
        areaOptions.angle,
        areaOptions.droneAltitude,
        areaOptions.longitudinalRedundancy,
        areaOptions.transverseRedundancy,
    ])

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

            {areaSize && (
                <div className="area_size">
                    <span>총면적: {areaSize}</span>
                </div>
            )}

            {activeMission === 'grid' && isOptions && (
                <GridMissionOptions
                    resetGridMission={resetGridMission}
                    areaOptions={areaOptions}
                    setAreaOptions={setAreaOptions}
                    setMissionData={setMissionData}
                    missionData={missionData}
                    submitGridMission={submitGridMission}
                />
            )}
        </>
    )
}
