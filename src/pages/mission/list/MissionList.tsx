import { Button } from '../../../components/button/Button'
import { IoClose } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MISSION } from '../../../constant/http'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'
import { MissionDto } from '../../../dto/MissionDto'
import { MissionListWrap } from './MissionListStyle'

interface MissionListProps {
    toggleMission: () => void
    isCreate: boolean
}

export const MissionList = ({ toggleMission, isCreate }: MissionListProps) => {
    const [missions, setMissions] = useState<MissionDto[]>([])
    const [selectMission, setSelectMission] = useState<null | MissionDto>(null)
    const [isUpdateMission, setIsUpdateMission] = useState(false)
    const [isHttpRequest, setIsHttpRequest] = useState(false)
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
            } catch (err) {
                console.log(err)
            }
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

    return (
        <MissionListWrap>
            <header>
                <h1>미션</h1>

                <Button type={'button'} onClick={toggleMission}>
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
                <article className="mission_info">
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
        </MissionListWrap>
    )
}
