import { useEffect, useRef, useState } from 'react'
import { AreaOptions } from '../../../constant/type'
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
    missionData: MissionDto
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
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
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>
    initMissionData: () => void
}

export const GridMission = ({
    map,
    missionData,
    isRunningMission,
    setMissionData,
    setIsRunningMission,
    setIsHttpRequest,
    initMissionData,
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

    const createGridMission = () => {
        let gridMissionListener: any = null

        if (isRunningMission.grid) {
            console.log('grid')

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
                        map: map ? map : undefined,
                        position: e.coord,
                        draggable: true,
                        clickable: true,
                        icon: {
                            content: `<div class='wayline_marker'>${mainPoint.length}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    })

                    mainPointMarker.push(marker)
                    setMarkers((prev) => [...prev, marker])
                    polygonRef.current && polygonRef.current.setPath(mainPoint)
                    polygonResize(marker, mainPointMarker)

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

                                gridMissionListener = null
                                setIsOptions((prev) => !prev)
                            }
                        )
                    }
                }
            )
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

                setIsHttpRequest((prev) => (prev = !prev))
                setIsRunningMission((prevMission) => ({
                    ...prevMission,
                    grid: false,
                    isStart: false,
                }))

                resetGridMission()
            } catch (err) {
                console.log(err)
            }
        } else {
            alert('모든 정보를 입력해주세요.')
        }
    }

    const resetGridMission = () => {
        clearMap()
        initMissionData()
        setMarkers([])
        setMainPoints([])
        setAreaSize(null)

        if (polygonRef.current) {
            polygonRef.current.setMap(null)
            polygonRef.current = null
        }

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

        polygonRef.current = null
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
        createGridMission()
    }, [])

    useEffect(() => {
        if (polygonRef.current && isOptions) createWays(polygonRef.current)
    }, [
        areaOptions.angle,
        areaOptions.droneAltitude,
        areaOptions.longitudinalRedundancy,
        areaOptions.transverseRedundancy,
    ])

    return (
        <>
            {areaSize && (
                <div className="area_size">
                    <span>총면적: {areaSize}</span>
                </div>
            )}

            {isRunningMission.grid && isOptions && (
                <GridMissionOptions
                    initMissionData={initMissionData}
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
