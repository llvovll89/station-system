import { useEffect, useRef, useState } from 'react'
import { MapWrap } from './MapStyles'
import axios from 'axios'
import { MISSION } from '../../constant/http'
import { MissionDto } from '../../dto/MissionDto'
import { AreaOptions, MissionType } from '../../constant/type'
import { AiOutlineReload } from 'react-icons/ai'
import { Button } from '../button/Button'
import React from 'react'
import {
    findMinMaxCoordinates,
    getDronePhotoWidth,
    haversineDistance,
    isPointInOverlayUtils,
} from '../../util/missionUtils'

declare global {
    interface Window {
        naver: any
    }
}

interface MapProps {
    latitude: number
    longitude: number
    isCreateStart?: boolean
    selectMission?: string | MissionType
    setIsCreateStart: React.Dispatch<React.SetStateAction<boolean>>
    setSelectMission: (value: string) => void
    missionData: MissionDto
    isCreateMission: boolean
}

export const NaverMap = React.memo(
    ({
        latitude,
        longitude,
        isCreateStart,
        selectMission,
        missionData,
        setIsCreateStart,
    }: MapProps) => {
        const [map, setMap] = useState(null)
        const [distance, setDistance] = useState<null | string>(null)
        const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
        const [polylines, setPolylines] = useState<naver.maps.Polyline[]>([])
        const [paths, setPaths] = useState<naver.maps.LatLng[]>([])
        const [polygon, setPolygon] = useState<naver.maps.Polygon | null>(null)
        const [areaOptions, setAreaOptions] = useState<AreaOptions>({
            droneAltitude: 100,
            speed: 5,
            angle: 45,
            fov: 70,
            droneAngle: 45,
            horizontalRedundancy: 70,
            verticalRedundancy: 70,
            photoWidthRatio: 4,
            photoHeightRatio: 3,
        })
        const [wayLines, setWayLines] = useState<naver.maps.Polyline[]>([])
        const [wayLine, setWayLine] = useState<naver.maps.Polyline | null>(null)

        const { naver } = window
        const mapElement = useRef(null)
        let mouseoverEvent: naver.maps.DOMEvent, guideline: naver.maps.Polyline

        const initMission = () => {
            resetOverlay()
            setIsCreateStart((prev) => !prev)
        }

        const submitPaths = async () => {
            try {
                const newPathArray = paths.map(({ x, y }) => ({
                    latitude: y,
                    longitude: x,
                }))
                const params = {
                    name: missionData.name,
                    points: newPathArray,
                    mainPoint: newPathArray[0],
                    angle: missionData.angle,
                }

                const response = await axios.post(MISSION, params)
                const data = await response.data

                console.log(data)
                resetOverlay() // 성공시에만 적용됨
            } catch (err) {
                console.log(err)
            }
        }

        const resetOverlay = () => {
            setMarkers((m) => {
                return m.map((marker) => {
                    marker.setMap(null)
                    return marker
                })
            })
            polylines &&
                setPolylines((p) => {
                    return p.map((polyline) => {
                        polyline.setMap(null)
                        return polyline
                    })
                })

            polygon &&
                setPolygon((prevPolygon) => {
                    return prevPolygon.setMap(null)
                })

            setPaths([])
            setDistance(null)
            setPolygon(null)
            setMarkers([])
            setPolylines([])
            initAreaOptions()
        }

        const initAreaOptions = () => {
            setAreaOptions({
                droneAltitude: 100,
                speed: 5,
                angle: 45,
                fov: 70,
                droneAngle: 45,
                overlapX: 70,
                overlapY: 70,
            })

            console.log(polylines, areaOptions)
        }

        const createMission = () => {
            if (isCreateStart) {
                if (selectMission === 'wayline') {
                    createOverLayEvent(selectMission)
                } else if (selectMission === 'region') {
                    createOverLayEvent(selectMission)
                }
            }
        }

        const createOverLayEvent = (type: string) => {
            const markerItems: naver.maps.Marker[] = []

            if (type === 'wayline') {
                const polyline = new naver.maps.Polyline({
                    map,
                    path: [],
                    strokeWeight: 4,
                    strokeColor: '#09f',
                })

                guideline = new naver.maps.Polyline({
                    map,
                    path: [],
                    strokeColor: '#ff005e',
                    strokeWeight: 4,
                    strokeStyle: [4, 4],
                    strokeOpacity: 0.7,
                })

                setPolylines((prevPolylines) => [...prevPolylines, polyline])
                const setPolyline = naver.maps.Event.addListener(
                    map,
                    'click',
                    (e: { coord: naver.maps.LatLng }) => {
                        const path = polyline.getPath()
                        path.push(e.coord)
                        setPaths((prevPaths) => [...prevPaths, e.coord])

                        const marker = new naver.maps.Marker({
                            map,
                            position: e.coord,
                            icon: {
                                content: `<div class='wayline_marker'>${markerItems.length + 1}</div>`,
                                anchor: new naver.maps.Point(12, 12),
                            },
                        })

                        setMarkers((prevMarkers) => [...prevMarkers, marker])
                        markerItems.push(marker)
                        if (mouseoverEvent) {
                            naver.maps.Event.removeListener(mouseoverEvent)
                        }

                        mouseoverEvent = naver.maps.Event.addListener(
                            map,
                            'mousemove',
                            (e: { coord: naver.maps.LatLng }) => {
                                if (markerItems.length > 0) {
                                    const lastMarkerPosition =
                                        markerItems[
                                            markerItems.length - 1
                                        ].getPosition()
                                    guideline.setPath([
                                        lastMarkerPosition,
                                        e.coord,
                                    ])
                                }
                            }
                        )

                        naver.maps.Event.addListener(
                            markerItems[markerItems.length - 1],
                            'click',
                            () => {
                                if (path.length > 1) {
                                    markerItems[markerItems.length - 1].setIcon(
                                        {
                                            content: `<div class='wayline_marker last'>${markerItems.length + 1}</div>`,
                                            anchor: new naver.maps.Point(
                                                12,
                                                12
                                            ),
                                        }
                                    )
                                    naver.maps.Event.removeListener(
                                        mouseoverEvent
                                    )
                                    naver.maps.Event.removeListener(setPolyline)
                                    guideline.setMap(null)

                                    setDistance(
                                        parseFloat(
                                            polyline.getDistance()
                                        ).toFixed(2)
                                    )
                                } else {
                                    alert('경로가 2개 이상일 때만 가능합니다!')
                                }
                            }
                        )
                    }
                )
            } else {
                createRegionMission()
            }
        }

        const createRegionMission = () => {
            let polygon,
                guideline,
                createGuideline,
                createPolygon,
                wayLineItems = []
            const markerItems: naver.maps.Marker[] = [],
                path: naver.maps.LatLng[] = []

            if (map) {
                map.setCursor(
                    `url(../../assets/image/cursor/ico_plus_blue.cur), default`
                )

                polygon = new naver.maps.Polygon({
                    map,
                    strokeColor: '#0080DE',
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    fillColor: '#fefefe',
                    fillOpacity: 0.6,
                    paths: [],
                    clickable: true,
                })

                guideline = new naver.maps.Polyline({
                    map,
                    path: [],
                    strokeColor: '#0080DE',
                    strokeWeight: 4,
                    strokeStyle: [4, 4],
                    strokeOpacity: 0.8,
                })

                createPolygon = naver.maps.Event.addListener(
                    map,
                    'click',
                    (e: { coord: naver.maps.LatLng }) => {
                        path.push(e.coord)

                        if (path.length === 1) {
                            markers.push(
                                new naver.maps.Marker({
                                    map,
                                    position: e.coord,
                                    icon: {
                                        content: `<div class='take_off'>T</div>`,
                                        anchor: new naver.maps.Point(16, 16),
                                    },
                                })
                            )
                        }

                        if (path.length > 1) {
                            const marker = new naver.maps.Marker({
                                position: e.coord,
                                map,
                                icon: {
                                    content: `<div class='polygon_marker'>${markerItems.length + 1}</div>`,
                                    anchor: new naver.maps.Point(12, 12),
                                },
                                clickable: true,
                            })
                            markerItems.push(marker)
                            setMarkers((prevMarker) => [...prevMarker, marker])
                            polygon.setPaths(path.slice(1))
                            setPolygon(polygon)

                            createGuideline = naver.maps.Event.addListener(
                                map,
                                'mousemove',
                                (e: { coord: naver.maps.LatLng }) => {
                                    const lastLatLng =
                                        markerItems.length > 0 &&
                                        markerItems.at(-1).getPosition()
                                    guideline.setPath([lastLatLng, e.coord])
                                }
                            )

                            naver.maps.Event.addListener(
                                markerItems.at(-1),
                                'click',
                                () => {
                                    naver.maps.Event.removeListener(
                                        createPolygon
                                    )

                                    naver.maps.Event.removeListener(
                                        createGuideline
                                    )

                                    guideline.setMap(null)
                                    map.setCursor('auto')

                                    const path = polygon.getPath().getArray()
                                    const points = path.map((point) => ({
                                        latitude: point.lat(),
                                        longitude: point.lng(),
                                    }))

                                    const minMaxPoints =
                                        findMinMaxCoordinates(points)
                                    const boundCenterPoint =
                                        new naver.maps.LatLng(
                                            (minMaxPoints[0].latitude +
                                                minMaxPoints[1].latitude) /
                                                2,
                                            (minMaxPoints[0].longitude +
                                                minMaxPoints[1].longitude) /
                                                2
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
                                    const maxBoundWidth =
                                        Math.max(boundWidth, boundHeight) * 2

                                    // 북 동 남 서
                                    const topLeftPoint = boundCenterPoint
                                        .destinationPoint(
                                            Number(areaOptions.angle),
                                            maxBoundWidth / 2
                                        )
                                        .destinationPoint(
                                            270 + Number(areaOptions.angle),
                                            maxBoundWidth / 2
                                        )
                                    const topRightPoint =
                                        topLeftPoint.destinationPoint(
                                            90 + Number(areaOptions.angle),
                                            maxBoundWidth
                                        )
                                    const bottomRightPoint =
                                        topRightPoint.destinationPoint(
                                            180 + Number(areaOptions.angle),
                                            maxBoundWidth
                                        )
                                    const bottomLeftPoint =
                                        bottomRightPoint.destinationPoint(
                                            270 + Number(areaOptions.angle),
                                            maxBoundWidth
                                        )

                                    const newBound =
                                        new naver.maps.LatLngBounds()
                                    newBound.extend(topLeftPoint)
                                    newBound.extend(topRightPoint)
                                    newBound.extend(bottomRightPoint)
                                    newBound.extend(bottomLeftPoint)

                                    const photoWidth =
                                        getDronePhotoWidth(areaOptions)
                                    const photoHeight = Math.floor(
                                        (photoWidth /
                                            areaOptions.photoWidthRatio) *
                                            areaOptions.photoHeightRatio
                                    )

                                    let widthPoint =
                                        topLeftPoint.destinationPoint(
                                            270 + Number(areaOptions.angle),
                                            photoWidth -
                                                (photoWidth *
                                                    areaOptions.horizontalRedundancy) /
                                                    100
                                        )
                                    const tempPoints = []
                                    let isReverse = false

                                    // eslint-disable-next-line no-constant-condition
                                    while (true) {
                                        const nextPoint =
                                            widthPoint.destinationPoint(
                                                90 + Number(areaOptions.angle),
                                                photoWidth -
                                                    (photoWidth *
                                                        areaOptions.horizontalRedundancy) /
                                                        100
                                            )
                                        const distanceToStartPoint =
                                            haversineDistance(
                                                topLeftPoint.lat(),
                                                topLeftPoint.lng(),
                                                nextPoint.lat(),
                                                nextPoint.lng()
                                            )

                                        if (
                                            distanceToStartPoint > maxBoundWidth
                                        ) {
                                            break
                                        }

                                        let underPoint = nextPoint
                                        const underPoints = []

                                        // eslint-disable-next-line no-constant-condition
                                        while (true) {
                                            const nextUnderPoint =
                                                underPoint.destinationPoint(
                                                    180 +
                                                        Number(
                                                            areaOptions.angle
                                                        ),
                                                    photoHeight -
                                                        (photoHeight *
                                                            areaOptions.verticalRedundancy) /
                                                            100
                                                )
                                            const distanceToWidthPoint =
                                                haversineDistance(
                                                    nextPoint.lat(),
                                                    nextPoint.lng(),
                                                    nextUnderPoint.lat(),
                                                    nextUnderPoint.lng()
                                                )

                                            if (
                                                distanceToWidthPoint >
                                                maxBoundWidth
                                            ) {
                                                break
                                            }

                                            if (isReverse) {
                                                underPoints.splice(
                                                    0,
                                                    0,
                                                    underPoint
                                                )
                                            } else {
                                                underPoints.push(underPoint)
                                            }

                                            underPoint = nextUnderPoint
                                        }

                                        if (isReverse) {
                                            tempPoints.push(
                                                ...underPoints,
                                                nextPoint
                                            )
                                        } else {
                                            tempPoints.push(
                                                nextPoint,
                                                ...underPoints
                                            )
                                        }

                                        widthPoint = nextPoint
                                        isReverse = !isReverse
                                    }

                                    for (
                                        let i = 0;
                                        i < tempPoints.length;
                                        i++
                                    ) {
                                        const point = {
                                            latitude: tempPoints[i].lat(),
                                            longitude: tempPoints[i].lng(),
                                        }

                                        if (
                                            isPointInOverlayUtils(point, points)
                                        ) {
                                            wayLineItems.push(tempPoints[i])
                                            // setWayLines((prevWayline) => [
                                            //     ...prevWayline,
                                            //     wayLineItems
                                            // ])
                                        }
                                    }

                                    console.log(wayLine, wayLineItems)

                                    const startMarker: naver.maps.Marker =
                                        new naver.maps.Marker({
                                            map,
                                            position: wayLineItems[0],
                                            icon: {
                                                content: `<img src="/src/assets/image/img/start_point.png" alt="start_point" class="w-[24px] h-[24px]">`,
                                                anchor: new naver.maps.Point(
                                                    12,
                                                    12
                                                ),
                                            },
                                        })

                                    setWayLine(
                                        new naver.maps.Polyline({
                                            map,
                                            path: wayLineItems,
                                            strokeColor: '#0CF395',
                                            strokeOpacity: 1,
                                            strokeWeight: 5,
                                        })
                                    )

                                    // this.createMissionData.distance = `${this.createMissionData.grid.wayLine.getDistance().toFixed(2)}m`
                                }
                            )
                        }
                    }
                )
            }
        }

        // const createWays = (points: Point[]) => {

        // }

        useEffect(() => {
            if (!mapElement.current || !naver) return

            const location = new naver.maps.LatLng(latitude, longitude)
            const mapOptions = {
                center: location,
                zoom: 17,
                zoomControl: false,
                mapDataControl: false,
                scaleControl: false,
            }

            setMap(new naver.maps.Map(mapElement.current, mapOptions))
        }, [])

        useEffect(() => {
            createMission()
        }, [isCreateStart, selectMission])

        return (
            <MapWrap>
                {distance && (
                    <div className="overlay_container">
                        {missionData.name && (
                            <div className="mission_type">
                                이름: {missionData.name}
                            </div>
                        )}
                        <div className="content">
                            <div className="distance">
                                <span>총 거리:</span>
                                <span>{distance}m</span>
                            </div>
                            <div className="markers">
                                <span>웨이포인트:</span>
                                <span>{markers.length}</span>
                            </div>
                        </div>
                        <div className="btn_container">
                            <button onClick={submitPaths}>저장</button>
                        </div>
                    </div>
                )}

                <div id="map" className="map" ref={mapElement}></div>

                {isCreateStart && (
                    <Button
                        onClick={initMission}
                        className="init_mission"
                        type="button"
                    >
                        <AiOutlineReload />
                    </Button>
                )}
            </MapWrap>
        )
    }
)
