import { Button } from '../../../components/button/Button'
import { IoClose } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { MISSION } from '../../../constant/http'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'
import { MissionDto } from '../../../dto/MissionDto'
import { MissionListWrap } from './MissionListStyle'
import axios from 'axios'

interface MissionListProps {
    toggleMission: () => void
    isCreate: boolean
    map: naver.maps.Map | null
    setIsActive: React.Dispatch<React.SetStateAction<string>>
}

export const MissionList = ({
    toggleMission,
    isCreate,
    map,
    setIsActive,
}: MissionListProps) => {
    const [missions, setMissions] = useState<MissionDto[]>([])
    const [selectMission, setSelectMission] = useState<null | MissionDto>(null)
    const [overlayData, setOverlayData] = useState({
        distance: '',
        areaSize: '',
    })
    const [isUpdateMission, setIsUpdateMission] = useState(false)
    const [isHttpRequest, setIsHttpRequest] = useState(false)
    const [isSelectInfo, setIsSelectInfo] = useState(false)
    const [currentMapElements, setCurrentMapElements] = useState<any[]>([])
    const [infoMission, setInfoMission] = useState<MissionDto>({
        seq: 0,
        name: '',
        type: 0,
        mainPoint: {
            latitude: 0,
            longitude: 0,
            height: 100,
        },
        createdAt: '',
        updatedAt: '',
        points: [],
        ways: [],
    })

    const closeMissionList = () => {
        clearMapElements()
        setIsActive('')
        toggleMission()
    }

    const getMission = async () => {
        try {
            const response = await axios.get(MISSION, { withCredentials: true })
            const data = await response.data
            setMissions(data)
            console.log(data)
            setIsHttpRequest(false)
        } catch (err) {
            console.log(err)
        }
    }

    const updateModal = () => {
        setIsUpdateMission((prev) => !prev)
    }

    const clearMapElements = () => {
        currentMapElements.forEach((element) => {
            console.log('element', element)
            element.setMap(null)
        })

        setOverlayData({
            ...overlayData,
            distance: '',
            areaSize: '',
        })

        setCurrentMapElements([])
    }

    const updeateMission = async (mission: MissionDto) => {
        try {
            const { seq } = mission
            const response = await axios.put(`${MISSION}/${seq}`, infoMission, {
                withCredentials: true,
            })
            const data = await response.data
            setIsHttpRequest((prev) => !prev)
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    const getInfoMission = async (mission: MissionDto) => {
        if (selectMission && mission.seq === selectMission.seq) {
            setSelectMission(null)
        } else {
            setSelectMission(mission)

            try {
                const { seq } = mission
                const response = await axios.get(`${MISSION}/${seq}`, {
                    withCredentials: true,
                })
                const data = await response.data
                console.log(data)

                setInfoMission({
                    ...infoMission,
                    seq: data.seq,
                    name: data.name,
                    type: data.type,
                    mainPoint: data.mainPoint,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    transverseRedundancy: data.transverseRedundancy,
                    longitudinalRedundancy: data.longitudinalRedundancy,
                    points: data.points,
                    ways: data.ways,
                })

                setIsSelectInfo(true)
            } catch (err) {
                console.log(err)
            }
        }
    }

    const setInfoDataForMap = () => {
        clearMapElements()

        if (infoMission.type === 0) {
            const polyline = new naver.maps.Polyline({
                map: map ? map : undefined,
                path: infoMission.ways.map(
                    (p) => new naver.maps.LatLng(p.latitude, p.longitude)
                ),
                strokeColor: '#2E8B57',
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeStyle: 'solid',
            })

            setOverlayData({
                ...overlayData,
                distance: polyline.getDistance().toFixed(2),
            })

            const markers = infoMission.ways.map(
                (p, index) =>
                    new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: new naver.maps.LatLng(
                            p.latitude,
                            p.longitude
                        ),
                        icon: {
                            content: `<div class='waypoint_marker'>${index + 1}</div>`,
                            anchor: new naver.maps.Point(9, 9),
                        },
                    })
            )

            map && map.fitBounds(polyline.getBounds())
            setCurrentMapElements([polyline, ...markers])
            console.log(polyline)
        } else {
            const mainPoints: naver.maps.Marker[] = []
            infoMission.points.forEach((p) => {
                mainPoints.push(
                    new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: new naver.maps.LatLng(
                            p.latitude,
                            p.longitude
                        ),
                        icon: {
                            content: `<div class='points_marker'></div>`,
                            anchor: new naver.maps.Point(9, 9),
                        },
                    })
                )
            })

            console.log('mainPoints', mainPoints)
            console.log('points', infoMission.points)

            const polygon = new naver.maps.Polygon({
                map: map ? map : undefined,
                paths: [
                    infoMission.points.map(
                        (p) => new naver.maps.LatLng(p.latitude, p.longitude)
                    ),
                ],
                strokeColor: '#0080DE',
                strokeOpacity: 1,
                strokeWeight: 4,
                fillColor: '#fefefe',
                fillOpacity: 0.6,
            })

            const polyline = new naver.maps.Polyline({
                map: map ? map : undefined,
                path: infoMission.ways.map(
                    (p) => new naver.maps.LatLng(p.latitude, p.longitude)
                ),
                strokeColor: '#2E8B57',
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeStyle: 'solid',
            })

            setOverlayData({
                ...overlayData,
                areaSize: polygon.getAreaSize().toFixed(2),
                distance: polyline.getDistance().toFixed(2),
            })

            const markers = infoMission.ways.map(
                (p, index) =>
                    new naver.maps.Marker({
                        map: map ? map : undefined,
                        position: new naver.maps.LatLng(
                            p.latitude,
                            p.longitude
                        ),
                        icon: {
                            content: `<div class='waypoint_marker'>${index + 1}</div>`,
                            anchor: new naver.maps.Point(12, 12),
                        },
                    })
            )

            map && map.fitBounds(polygon.getBounds())

            console.log(polygon, polyline)
            setCurrentMapElements([
                ...mainPoints,
                polygon,
                polyline,
                ...markers,
            ])
        }
    }

    const deleteMission = async (mission: MissionDto) => {
        const deleteAlert = confirm('정말 삭제 하시겠습니까?')

        if (deleteAlert) {
            try {
                const { seq } = mission
                const response = await axios.delete(`${MISSION}/${seq}`, {
                    withCredentials: true,
                })
                const data = await response.data
                console.log(data)
                setIsHttpRequest((prev) => !prev)
            } catch (err) {
                console.log(err)
            }
        } else {
            return
        }
    }

    useEffect(() => {
        getMission()
    }, [isCreate, isHttpRequest])

    useEffect(() => {
        if (isSelectInfo) {
            setInfoDataForMap()
        }
    }, [infoMission])

    return (
        <MissionListWrap>
            <header>
                <h1>미션</h1>

                <Button type={'button'} onClick={closeMissionList}>
                    <IoClose />
                </Button>
            </header>

            <article className="container">
                <div className="content">
                    {missions.length > 0 &&
                        missions.map((mission) => (
                            <ul
                                className={`mission ${selectMission && selectMission.seq === mission.seq ? 'active' : ''}`}
                                key={mission.seq}
                                onClick={() => getInfoMission(mission)}
                            >
                                <header>
                                    <p className="mission_name">
                                        {mission.name}
                                    </p>

                                    <div className="content_actios">
                                        <button onClick={updateModal}>
                                            <CiEdit />
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteMission(mission)
                                            }
                                        >
                                            <MdOutlineDelete />
                                        </button>
                                    </div>
                                </header>

                                <div className="content">
                                    <p>
                                        (
                                        {mission.type === 0
                                            ? '웨이포인트'
                                            : '그리드'}
                                        )
                                    </p>

                                    <div className="date">
                                        <span>{mission.createdAt}</span>
                                        <span>{mission.updatedAt}</span>
                                    </div>
                                </div>
                            </ul>
                        ))}
                </div>
            </article>

            {isUpdateMission && (
                <article className="update_mission">
                    <header>
                        <p>미션 수정</p>
                        <div className="content_actios">
                            <Button
                                className="close_btn"
                                type="button"
                                onClick={() =>
                                    setIsUpdateMission((prev) => !prev)
                                }
                            >
                                <span>X</span>
                            </Button>
                        </div>
                    </header>

                    <div className="content">
                        <div className="top">
                            <label htmlFor="name">미션명</label>
                            <input
                                type="text"
                                value={infoMission.name}
                                onChange={(e) =>
                                    setInfoMission({
                                        ...infoMission,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <p className="mission_type">
                            {infoMission.type === 0 ? '웨이포인트' : '그리드'}
                        </p>

                        <div className="ways">
                            <div>
                                <span>웨이포인트:</span>
                                <span>{infoMission.ways.length}</span>
                            </div>
                            <div>
                                <span>도형 포인트:</span>
                                <span>{infoMission.points.length}</span>
                            </div>
                        </div>

                        <div className="date">
                            <span>생성날짜 - {infoMission.createdAt}</span>
                            <span>업데이트 날짜 - {infoMission.updatedAt}</span>
                        </div>

                        <Button
                            type="button"
                            className="update_btn"
                            onClick={() => updeateMission(infoMission)}
                        >
                            <span>수정하기</span>
                        </Button>
                    </div>
                </article>
            )}

            {isSelectInfo && (
                <article className="mission_info">
                    <header>
                        <p>{infoMission.name}</p>
                        <div className="content_actios">
                            <span>웨이포인트 {infoMission.points.length}</span>
                        </div>
                    </header>

                    <div className="content">
                        <span>비행거리 {overlayData.distance} m</span>
                        <span>비행면적 {overlayData.areaSize} 제곱미터</span>
                    </div>
                </article>
            )}
        </MissionListWrap>
    )
}
