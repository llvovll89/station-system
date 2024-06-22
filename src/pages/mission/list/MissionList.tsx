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
}

export const MissionList = ({ toggleMission }: MissionListProps) => {
    const [missions, setMissions] = useState<MissionDto[]>([])

    const getMission = async () => {
        try {
            const response = await axios.get(MISSION, { withCredentials: true })
            const data = await response.data
            setMissions(data)
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    const updeateMission = async (mission: MissionDto) => {
        try {
            const { seq } = mission
            const params = {
                name: '',
                type: 1,
                mainPoint: [],
                points: [],
                ways: [],
                angle: 70,
                transverseRedundancy: 0,
                longitudinalRedundancy: 0,
            }
            const response = await axios.put(MISSION + `${seq}`, {
                withCredentials: true,
            })
            const data = await response.data

            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    // const getInfoMission = async (mission) => {
    //     try {
    //         const { seq } = mission
    //         const response = await axios.get(MISSION + `${seq}`, {
    //             withCredentials: true,
    //         })
    //         const data = await response.data

    //         console.log(data)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const deleteMission = async (mission: MissionDto) => {
        try {
            const { seq } = mission
            const response = await axios.delete(MISSION + `${seq}`, {
                withCredentials: true,
            })
            const data = await response.data
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        // mission 요청 에러가 나서 막아둠
        getMission()
    }, [])

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
                            <ul className="mission" key={mission.seq}>
                                <header>
                                    <p className="mission_name">
                                        {mission.name}
                                    </p>
                                    <div className="content_actios">
                                        <button
                                            onClick={() =>
                                                updeateMission(mission)
                                            }
                                        >
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
                                        {mission.type === 0
                                            ? '웨이포인트'
                                            : '그리드'}
                                        미션
                                    </p>
                                    {/* <div className="date">
                                        <span>{mission?.createdAt}</span>
                                        <span>{mission?.updatedAt}</span>
                                    </div> */}
                                </div>
                            </ul>
                        ))}
                </div>
            </article>
        </MissionListWrap>
    )
}
