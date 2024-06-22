import { useState } from 'react'
import { AreaOptions, MissionStateItem } from '../../../constant/type'
import { Button } from '../../../components/button/Button'
import { TbAtom } from 'react-icons/tb'
import {
    findMinMaxCoordinates,
    haversineDistance,
    isPointInOverlayUtils,
} from '../../../util/missionUtils'
import { GridMissionWrap } from './GridMissionStyle'

interface GridMissionProps {
    map: naver.maps.Map | null
    missionState: MissionStateItem
    setMissionState: React.Dispatch<React.SetStateAction<MissionStateItem>>
    areaOptions: AreaOptions
    setAreaOptions: React.Dispatch<React.SetStateAction<AreaOptions>>
    activeMission: null | 'waypoint' | 'grid'
}

export const GridMission = ({
    map,
    areaOptions,
    setMissionState,
    setAreaOptions,
    activeMission,
}: GridMissionProps) => {
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
    const [wayLines, setWayLines] = useState<naver.maps.LatLng[]>([])
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
    const [isDrawing, setIsDrawing] = useState(false)

    const mainPointMarker: naver.maps.Marker[] = []
    const mainPoint: naver.maps.LatLng[] = []
    const polygon = new naver.maps.Polygon({
        map,
        paths: [],
        strokeColor: '#0080DE',
        strokeOpacity: 1,
        strokeWeight: 4,
        fillColor: '#fefefe',
        fillOpacity: 0.6,
        strokeStyle: 'solid',
    })

    const guideLine = new naver.maps.Polyline({
        map,
        path: [],
        strokeColor: '#0080DE',
        strokeWeight: 4,
        strokeStyle: [4, 4],
        strokeOpacity: 0.8,
    })

    const createGridMission = () => {
        if (map) {
            setIsDrawing((prev) => !prev)

            const setGridMission = naver.maps.Event.addListener(
                map,
                'click',
                (e: { coord: naver.maps.LatLng }) => {
                    mainPoint.push(e.coord)
                    setMainPoints((prev) => [...prev, e.coord])

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
                    polygonResize(marker)
                    polygon.setPath(mainPoint)

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
                                // createWays(polygon)
                                // setIsDrawing(false)
                                naver.maps.Event.removeListener(setGridMission)
                                naver.maps.Event.removeListener(createGuideLine)
                                initSetOverlay()
                                // calculateArea(mainPoint)
                                // calculateDistances(mainPoint)
                            }
                        )
                    }
                }
            )
        }
    }

    const initSetOverlay = () => {
        guideLine.setMap(null)
    }

    const polygonResize = (marker: naver.maps.Marker) => {
        naver.maps.Event.addListener(
            marker,
            'drag',
            (e: { coord: naver.maps.LatLng }) => {
                const newMainPoints = mainPoints.map((point, index) =>
                    markers[index] === marker ? e.coord : point
                )
                setMainPoints(newMainPoints)
                if (polygon) {
                    polygon.setPath(newMainPoints)
                    calculateDistances(newMainPoints)
                }
            }
        )
    }

    const calculateArea = (points: naver.maps.LatLng[]) => {
        // const path = points.map(point => point.toCoords())
        // const polygon = new naver.maps.Geometry.Polygon(path)
        // const areaSize = naver.maps.GeometryUtil.getArea(polygon)
        // setArea(areaSize)
    }

    const calculateDistances = (points: naver.maps.LatLng[]) => {
        for (let i = 0; i < points.length; i++) {
            const start = points[i]
            const end = points[(i + 1) % points.length]
            const distance = wayLines.getDistance(start, end)

            const midPoint = new naver.maps.LatLng(
                (start.lat() + end.lat()) / 2,
                (start.lng() + end.lng()) / 2
            )

            new naver.maps.InfoWindow({
                content: `<div>${distance.toFixed(2)}m</div>`,
                position: midPoint,
                map,
            }).open(map)
        }
    }

    const createWays = (polygon: naver.maps.Polygon) => {
        const wayLineItems = []
        let path
        let points

        if (polygon.getPath()) {
            path = polygon.getPath()?.getArray()
        } else {
            path = polygon.getPath()
            // path.push(polygonPath)
        }

        points = path.map((point: any) => ({
            latitude: point.lat(),
            longitude: point.lng(),
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

        const newBound = new naver.maps.LatLngBounds()
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
            photoWidth - (photoWidth * areaOptions.horizontalRedundancy) / 100
        )
        const tempPoints = []
        let isReverse = false

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const nextPoint = widthPoint.destinationPoint(
                90 + Number(areaOptions.angle),
                photoWidth -
                    (photoWidth * areaOptions.horizontalRedundancy) / 100
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
                        (photoHeight * areaOptions.verticalRedundancy) / 100
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
            }

            if (isPointInOverlayUtils(point, points)) {
                wayLineItems.push(tempPoints[i])
            }
        }

        setOverlay(wayLineItems)
    }

    const setOverlay = (wayLineItems: naver.maps.Polyline[]) => {
        adedOverlay.startMarker && adedOverlay.startMarker.setMap(null)
        adedOverlay.endMarker && adedOverlay.endMarker.setMap(null)
        adedOverlay.takeoffPolyLine && adedOverlay.takeoffPolyLine.setMap(null)
        adedOverlay.wayLine && adedOverlay.wayLine.setMap(null)

        const newStartMarker = new naver.maps.Marker({
            map,
            position: wayLineItems[0],
            icon: {
                content: `<div class='start_marker'>S</div>`,
                anchor: new naver.maps.Point(14, 14),
            },
        })

        const newTakeoffPolyLine = new naver.maps.Polyline({
            map,
            path: [overLayMarkers[0].getPosition(), wayLineItems[0]],
            strokeColor: '#0CF395',
            strokeOpacity: 1,
            strokeWeight: 5,
        })

        const newWayLine = new naver.maps.Polyline({
            map,
            path: wayLineItems,
            strokeColor: '#0CF395',
            strokeOpacity: 1,
            strokeWeight: 5,
        })

        const newEndMarker = new naver.maps.Marker({
            map,
            position: wayLineItems[wayLineItems.length - 1],
            icon: {
                content: `<div class='end_marker'>E</div>`,
                anchor: new naver.maps.Point(14, 14),
            },
        })

        adedOverlay.startMarker = newStartMarker
        adedOverlay.endMarker = newEndMarker
        adedOverlay.takeoffPolyLine = newTakeoffPolyLine
        adedOverlay.wayLine = newWayLine

        setWayLine(newWayLine)
    }

    return (
        <GridMissionWrap className={activeMission !== 'grid' ? 'disabled' : ''}>
            <Button
                type="button"
                className="create_grid_mission"
                onClick={createGridMission}
                disabled={isDrawing}
            >
                <TbAtom />
                <span>Grid</span>
            </Button>
        </GridMissionWrap>
    )
}
