import { IoClose, IoCreateOutline } from 'react-icons/io5'
import { ScheduleListWrap } from './ScheduleListSyle'
import { Button } from '../../../components/button/Button'
import axios from 'axios'
import { SCHEDULE } from '../../../constant/http'
import { useEffect, useState } from 'react'
import { SchduleDto } from '../../../dto/ScheduleDto'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'

interface ScheduleListProps {
    toggleSchedule: () => void
    toggleCreateSchedule: () => void
    setIsActive: React.Dispatch<React.SetStateAction<string>>
    isHttpRequest: boolean
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>
}

export const ScheduleList = ({
    toggleSchedule,
    toggleCreateSchedule,
    setIsActive,
    isHttpRequest,
    setIsHttpRequest,
}: ScheduleListProps) => {
    const [schedules, setSchedules] = useState<SchduleDto[]>([])
    const [selectSchedule, setSelectSchedule] = useState<SchduleDto | null>(
        null
    )

    const getSchedule = async () => {
        try {
            const response = await axios.get(SCHEDULE, {
                withCredentials: true,
            })
            const data = await response.data
            setSchedules(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const toggleActiveSchedule = () => {
        toggleSchedule()
        setIsActive('')
    }

    const updateSchedule = async (schedule: SchduleDto) => {
        try {
            const response = await axios.post(`${SCHEDULE}/${schedule.seq}`)
            const data = await response.data

            console.log(data)
            setIsHttpRequest((prev) => !prev)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteSchdule = async (schedule: SchduleDto) => {
        try {
            const response = await axios.delete(`${SCHEDULE}/${schedule.seq}`)
            const data = await response.data

            console.log(data)
            setIsHttpRequest((prev) => !prev)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSchedule()
    }, [isHttpRequest])

    return (
        <ScheduleListWrap>
            <header>
                <h1>스케줄</h1>

                <div className="content_btn">
                    <Button type={'button'} onClick={toggleCreateSchedule}>
                        <IoCreateOutline />
                    </Button>
                    <Button type={'button'} onClick={toggleActiveSchedule}>
                        <IoClose />
                    </Button>
                </div>
            </header>

            <article className="container">
                <ul className="schedule_list">
                    {schedules.length > 0 &&
                        schedules.map((schedule) => (
                            <li
                                className={`schedule ${selectSchedule?.seq === schedule.seq ? 'active' : ''}`}
                                key={schedule.seq}
                                onClick={() => setSelectSchedule(schedule)}
                            >
                                <div className="content_header">
                                    <span>스케줄명: {schedule.name}</span>
                                    <div className="btn_box">
                                        <button
                                            onClick={() =>
                                                updateSchedule(schedule)
                                            }
                                        >
                                            <CiEdit
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                }}
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteSchdule(schedule)
                                            }
                                        >
                                            <MdOutlineDelete
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="scheudle_content">
                                    <span>상태: {schedule.status}</span>
                                </div>
                            </li>
                        ))}
                </ul>
            </article>
        </ScheduleListWrap>
    )
}
