import { useEffect, useRef, useState } from 'react'
import { MapWrap } from './MapStyles'
import axios from 'axios'
import { MISSION } from '../../constant/http'
import { MissionDto } from '../../dto/MissionDto'
import { AreaOptions, MissionType, OverlayType } from '../../constant/type'
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
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
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
        setMissionData,
        setIsCreateStart,
    }: MapProps) => {
        const [map, setMap] = useState(null)
        const [isResult, setIsResult] = useState(false)
        const [distance, setDistance] = useState<null | string>(null)
        const [polylines, setPolylines] = useState<naver.maps.Polyline[]>([])
        const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
        const [paths, setPaths] = useState<naver.maps.LatLng[]>([])
        const [areaOptions, setAreaOptions] = useState<AreaOptions>({
            droneAltitude: 100,
            speed: 5,
            angle: 45,
            droneAngle: 45,
            horizontalRedundancy: 70,
            verticalRedundancy: 70,
            photoWidthRatio: 4,
            photoHeightRatio: 3,
        })
        const [wayLine, setWayLine] = useState<naver.maps.Polyline | null>(null)
        const [naverMapEvent, setNaverMapEvent] = useState({
            waypoint: null,
            region: null,
        })

        const { naver } = window
        const mapElement = useRef(null)
        const wayPointPolyline: naver.maps.Polyline = new naver.maps.Polyline({
            map,
            path: [],
            strokeWeight: 4,
            strokeColor: '#09f',
        })
        let overLayMarkers: naver.maps.Marker[] = []
        const adedOverlay: OverlayType = {
            startMarker: null,
            endMarker: null,
            takeoffPolyLine: null,
            wayLine: new naver.maps.Polyline({
                map,
                path: [],
            }),
        }
        const polygonPath: naver.maps.LatLng[][] = []

        const polygon: naver.maps.Polygon = new naver.maps.Polygon({
            map,
            strokeColor: '#0080DE',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillColor: '#fefefe',
            fillOpacity: 0.6,
            paths: [],
            clickable: true,
            strokeStyle: 'solid',
        })

        let mouseoverEvent: naver.maps.DOMEvent, guideline: naver.maps.Polyline

        const submitMission = async (type: string) => {
            if (type === 'waypoint') {
                // waypoint mission
                try {
                    const params = {
                        name: '',
                        type: 0,
                        mainPont: [],
                        points: [],
                        wayas: [],
                        transverseRedundancy: 0,
                        longitudinalRedundancy: 0,
                        angle: 0,
                    }

                    const response = await axios.post(MISSION, params, {
                        withCredentials: true,
                    })
                    const data = await response.data
                    console.log(data)
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log(type)
            }
        }

        const initMission = () => {
            resetOverlay()
            setIsCreateStart((prev) => !prev)
            setIsResult((prev) => !prev)
            naver.maps.Event.removeListener(naverMapEvent.region)
            naver.maps.Event.removeListener(naverMapEvent.waypoint)
        }

        const resetOverlay = () => {
            polylines &&
                setPolylines((p) => {
                    return p.map((polyline) => {
                        polyline.setMap(null)
                        return polyline
                    })
                })

            markers.length > 0 &&
                setMarkers((m) => {
                    return m.map((marker) => {
                        marker.setMap(null)
                        return marker
                    })
                })
            overLayMarkers.length > 0 &&
                overLayMarkers.forEach((m) => m.setMap(null))
            adedOverlay.wayLine && adedOverlay.wayLine.setMap(null)

            polygon && polygon.setMap(null)
            overLayMarkers = []
            setPaths([])
            setDistance(null)
            setPolylines([])
            initAreaOptions()
            setIsResult((prev) => !prev)
        }

        const initAreaOptions = () => {
            setAreaOptions({
                droneAltitude: 100,
                speed: 5,
                angle: 45,
                droneAngle: 45,
                horizontalRedundancy: 70,
                verticalRedundancy: 70,
                photoWidthRatio: 4,
                photoHeightRatio: 3,
            })
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
            const paths: naver.maps.LatLng[] = []

            if (type === 'wayline') {
                guideline = new naver.maps.Polyline({
                    map,
                    path: [],
                    strokeColor: '#ff005e',
                    strokeWeight: 4,
                    strokeStyle: [4, 4],
                    strokeOpacity: 0.7,
                })

                setPolylines((prevPolylines) => [
                    ...prevPolylines,
                    wayPointPolyline,
                ])

                const setPolyline = naver.maps.Event.addListener(
                    map,
                    'click',
                    (e: { coord: naver.maps.LatLng }) => {
                        const path =
                            wayPointPolyline.getPath() as naver.maps.ArrayOfCoords
                        path.push(e.coord)
                        paths.push(e.coord)
                        setPaths((prevPaths) => [...prevPaths, e.coord])

                        const marker = new naver.maps.Marker({
                            map,
                            position: e.coord,
                            draggable: true,
                            icon: {
                                content: `<div class='wayline_marker'>${overLayMarkers.length + 1}</div>`,
                                anchor: new naver.maps.Point(12, 12),
                            },
                        })

                        setNaverMapEvent((prev) => ({
                            ...prev,
                            waypoint: setPolyline,
                        }))

                        overLayMarkers.push(marker)
                        setMarkers((prev) => [...prev, marker])

                        if (mouseoverEvent) {
                            naver.maps.Event.removeListener(mouseoverEvent)
                        }

                        mouseoverEvent = naver.maps.Event.addListener(
                            map,
                            'mousemove',
                            (e: { coord: naver.maps.LatLng }) => {
                                if (overLayMarkers.length > 0) {
                                    const lastMarkerPosition =
                                        overLayMarkers[
                                            overLayMarkers.length - 1
                                        ].getPosition()
                                    guideline.setPath([
                                        lastMarkerPosition,
                                        e.coord,
                                    ])
                                }
                            }
                        )

                        resizeWaypoints(
                            overLayMarkers,
                            marker,
                            paths,
                            wayPointPolyline
                        )

                        naver.maps.Event.addListener(
                            overLayMarkers[overLayMarkers.length - 1],
                            'click',
                            () => {
                                if (path.length > 1) {
                                    overLayMarkers[
                                        overLayMarkers.length - 1
                                    ].setIcon({
                                        content: `<div class='wayline_marker last'>${overLayMarkers.length}</div>`,
                                        anchor: new naver.maps.Point(12, 12),
                                    })
                                    naver.maps.Event.removeListener(
                                        mouseoverEvent
                                    )
                                    naver.maps.Event.removeListener(setPolyline)
                                    guideline.setMap(null)
                                    getDistance()
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

        const resizeWaypoints = (
            overLayMarkers: naver.maps.Marker[],
            marker: naver.maps.Marker,
            paths: naver.maps.LatLng[],
            wayPointPolyline: naver.maps.Polyline
        ) => {
            const resizeEvent = naver.maps.Event.addListener(
                marker,
                'drag',
                (e: { coord: naver.maps.LatLng }) => {
                    const index = overLayMarkers.indexOf(marker)
                    if (index !== -1) {
                        paths[index] = e.coord
                        wayPointPolyline.setPath(paths)
                        getDistance()
                    }
                }
            )

            console.log(resizeEvent)
        }

        const getDistance = () => {
            const distance = wayPointPolyline.getDistance()
            if (Math.floor(distance) >= 1000) {
                setDistance((distance / 1000).toFixed(1) + ' km')
            } else {
                setDistance(distance.toFixed(1) + ' m')
            }
        }

        const createRegionMission = () => {
            let guideline: naver.maps.Polyline,
                createGuideline: naver.maps.DOMEvent,
                createPolygon: naver.maps.DOMEvent

            const mainPoints: naver.maps.LatLng[] = []

            if (map) {
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
                        mainPoints.push(e.coord)
                        setPaths((prevPaths) => [...prevPaths, e.coord])

                        if (mainPoints.length === 1) {
                            const marker = new naver.maps.Marker({
                                map,
                                position: e.coord,
                                icon: {
                                    content: `<div class='take_off'>T</div>`,
                                    anchor: new naver.maps.Point(16, 16),
                                },
                            })
                            overLayMarkers.push(marker)
                            setMarkers((prev) => [...prev, marker])
                        }

                        if (mainPoints.length > 1) {
                            const marker = new naver.maps.Marker({
                                position: e.coord,
                                map,
                                icon: {
                                    content: `<div class='polygon_marker'>${overLayMarkers.length + 1}</div>`,
                                    anchor: new naver.maps.Point(12, 12),
                                },
                                clickable: true,
                                draggable: true,
                            })

                            overLayMarkers.push(marker)
                            setMarkers((prev) => [...prev, marker])
                            polygon.setPath(mainPoints.slice(1))
                            polygonPath.push(mainPoints.slice(1))

                            createGuideline = naver.maps.Event.addListener(
                                map,
                                'mousemove',
                                (e: { coord: naver.maps.LatLng }) => {
                                    const lastLatLng =
                                        overLayMarkers[
                                            overLayMarkers.length - 1
                                        ].getPosition()
                                    overLayMarkers.length > 0 &&
                                        guideline.setPath([lastLatLng, e.coord])
                                }
                            )

                            naver.maps.Event.addListener(
                                overLayMarkers[overLayMarkers.length - 1],
                                'click',
                                () => {
                                    naver.maps.Event.removeListener(
                                        createPolygon
                                    )

                                    naver.maps.Event.removeListener(
                                        createGuideline
                                    )

                                    guideline.setMap(null)

                                    createWays(polygon)
                                    setIsResult(true)
                                    editingRegionMission(mainPoints)
                                }
                            )
                        }
                    }
                )
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
                photoWidth -
                    (photoWidth * areaOptions.horizontalRedundancy) / 100
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
            adedOverlay.takeoffPolyLine &&
                adedOverlay.takeoffPolyLine.setMap(null)
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

        const editingRegionMission = (mainPoints: naver.maps.LatLng[]) => {
            mainPoints.forEach((_, index) => {
                naver.maps.Event.addListener(
                    overLayMarkers[index],
                    'drag',
                    (e: { coord: naver.maps.LatLng }) => {
                        mainPoints[index] = e.coord
                        adedOverlay.wayLine && adedOverlay.wayLine.setMap(null)
                        adedOverlay.startMarker &&
                            adedOverlay.startMarker.setMap(null)
                        adedOverlay.takeoffPolyLine &&
                            adedOverlay.takeoffPolyLine.setMap(null)

                        polygon.setOptions({
                            strokeColor: '#0080DE',
                            strokeWeight: 4,
                            strokeStyle: [4, 4] as any,
                            paths: mainPoints.slice(1) as any,
                        })
                    }
                )

                naver.maps.Event.addListener(
                    overLayMarkers[index],
                    'dragend',
                    () => {
                        polygon.setOptions({
                            strokeColor: '#0080DE',
                            strokeOpacity: 1,
                            strokeWeight: 4,
                            fillColor: '#fefefe',
                            fillOpacity: 0.6,
                            strokeStyle: 'solid',
                        } as naver.maps.PolygonOptions)

                        createWays(polygon)
                    }
                )
            })
        }

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
                <div id="map" className="map" ref={mapElement}></div>

                {isResult && (
                    <div className="overlay_container">
                        <p>
                            비행거리: {wayLine?.getDistance().toFixed(2) + 'm'}
                        </p>
                    </div>
                )}

                {isCreateStart && (
                    <Button
                        onClick={initMission}
                        className="init_mission"
                        type="button"
                    >
                        <AiOutlineReload />
                    </Button>
                )}

                {selectMission === 'region' && isCreateStart && (
                    <aside className="mission_options">
                        <p>그리드 미션</p>

                        <ul className="region_list">
                            <li className="items">
                                <div className="items_div">
                                    <label>speed</label>
                                    <span>{areaOptions.speed}</span>
                                </div>

                                <input
                                    value={areaOptions.speed}
                                    onChange={(e) => {
                                        setAreaOptions({
                                            ...areaOptions,
                                            speed: Number(e.target.value),
                                        })
                                    }}
                                    type="range"
                                    max={'15'}
                                    min={'1'}
                                />
                            </li>
                            <li className="items">
                                <div className="items_div">
                                    <label>horizontalRedundancy</label>
                                    <span>
                                        {areaOptions.horizontalRedundancy}
                                    </span>
                                </div>

                                {polygon && (
                                    <input
                                        value={areaOptions.horizontalRedundancy}
                                        onChange={(e) => {
                                            setAreaOptions({
                                                ...areaOptions,
                                                horizontalRedundancy: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }}
                                        onMouseUp={() => {
                                            createWays(polygon)
                                        }}
                                        type="range"
                                        max={'100'}
                                        min={'0'}
                                    />
                                )}
                            </li>
                            <li className="items">
                                <div className="items_div">
                                    <label>verticalRedundancy</label>
                                    <span>
                                        {areaOptions.verticalRedundancy}
                                    </span>
                                </div>

                                {polygon && (
                                    <input
                                        value={areaOptions.verticalRedundancy}
                                        onChange={(e) => {
                                            setAreaOptions({
                                                ...areaOptions,
                                                verticalRedundancy: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }}
                                        onMouseUp={() => {
                                            createWays(polygon)
                                        }}
                                        type="range"
                                        max={'100'}
                                        min={'0'}
                                    />
                                )}
                            </li>
                            <li className="items">
                                <div className="items_div">
                                    <label>camera Angle</label>
                                    <span>{areaOptions.angle}</span>
                                </div>

                                {polygon && (
                                    <input
                                        onChange={(e) => {
                                            setAreaOptions({
                                                ...areaOptions,
                                                angle: Number(e.target.value),
                                            })
                                        }}
                                        onMouseUp={() => {
                                            createWays(polygon)
                                        }}
                                        value={areaOptions.angle}
                                        type="range"
                                        min={'0'}
                                        max={'360'}
                                    />
                                )}
                            </li>
                            <li className="items">
                                <div className="items_div">
                                    <label>altitude</label>
                                    <span>{areaOptions.droneAltitude}</span>
                                </div>
                                {polygon && (
                                    <input
                                        onChange={(e) => {
                                            setAreaOptions({
                                                ...areaOptions,
                                                droneAltitude: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }}
                                        onMouseUp={() => {
                                            createWays(polygon)
                                        }}
                                        value={areaOptions.droneAltitude}
                                        type="range"
                                        max={'500'}
                                    />
                                )}
                            </li>
                        </ul>
                    </aside>
                )}
            </MapWrap>
        )
    }
)
