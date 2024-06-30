import styled from 'styled-components'
import { Button } from '../../components/button/Button'
import { IoClose } from 'react-icons/io5'
import { MISSION, SCHEDULE } from '../../constant/http'
import axios from 'axios'
import { StationDto } from '../../dto/Station'
import React, { useEffect, useState } from 'react'
import theme from '../../styles/theme'
import { MissionDto } from '../../dto/MissionDto'

const NewSchduleWrqp = styled.section`
    position: absolute;
    min-width: 450px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #000000;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 50;
    color: ${theme.color.white};

    & header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & button {
            height: 32px;
            width: 32px;

            & svg {
                width: 22px;
                height: 22px;
            }
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        & .name {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            & input {
                height: 36px;
                border: 1px solid rgba(255,2525,255, 0.26);
                padding: 0 0.52rem;
                color: ${theme.color.white};
                border-radius: 5px;

                &:focus {
                    border: 1px solid ${theme.color.primary};
                    color: ${theme.color.primary};
                }
            }
        }

        & .station,
        & .mission {
            width: 100%;
            padding: 0.5rem; 0.3rem;
            border: 1px solid rgba(255,2525,255, 0.16);
            border-radius: 5px;

            & span {
                font-weight: bold;
            }

            & p {
                font-size: 14px;
            }
        }

        & .station {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            & .station_content {
                display: flex;
                gap: 0.5rem;
                justify-content: space-between;
                align-items: center;
                padding: 0.25rem; 0.3rem;
                border-radius: 5px;
                
                &.active {
                    background-color: ${theme.color.primary};
                    color: ${theme.color.white};
                }
            }
        }

        & .mission {
            & ul {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                & li {
                    border-bottom: 1px solid rgba(255,2525,255, 0.16);
                    cursor: pointer;
                    padding: 0.25rem; 0.3rem;
                    border-radius: 5px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;

                    &.active {
                        background: ${theme.color.primary};
                        color: ${theme.color.white};
                    }

                    &:last-childe {
                        border-bottom: none;
                    }
                }
            }
        }
    }

    .content_btn {
        display: flex;
        align-items: center;
        gap: 0.35rem;

        & button {
            width: 100%;
            border-radius: 5px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            border: 1px solid rgba(255,255,255,0.33);

            &:hover {
                background-color: ${theme.color.primary};
            }
        }
    }
`

interface NewSchduleProps {
    toggleCreateSchedule: () => void
    station: StationDto | null
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewSchdule = ({
    toggleCreateSchedule,
    station,
    setIsHttpRequest,
}: NewSchduleProps) => {
    const [missions, setMissions] = useState<MissionDto[]>([])
    const [createData, setCreateData] = useState({
        name: '',
        stationSEQ: 0,
        missionSEQ: 0,
    })

    const createScheudle = async () => {
        if (createData.name === '') {
            alert('스케줄 명을 입력해 주세요!')
            return
        }

        if (createData.stationSEQ === 0) {
            alert('스테이션을 선택해 주세요!')
            return
        }

        if (createData.missionSEQ === 0) {
            alert('미션을 선택해 주세요!')
            return
        }

        console.log('createData:', createData)

        try {
            const response = await axios.post(SCHEDULE, createData, {
                withCredentials: true,
            })
            const data = await response.data
            console.log('create_schedule:', data)
            setIsHttpRequest((prev) => !prev)
        } catch (error) {
            console.log(error)
        }
    }

    const resetScheudle = () => {
        setCreateData({
            name: '',
            stationSEQ: 0,
            missionSEQ: 0,
        })

        toggleCreateSchedule()
    }

    const getMission = async () => {
        try {
            const response = await axios.get(MISSION, { withCredentials: true })
            const data = await response.data
            setMissions(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMission()
    }, [])

    return (
        <>
            <NewSchduleWrqp>
                <header>
                    <h1>New Schedule</h1>
                    <Button type={'button'} onClick={toggleCreateSchedule}>
                        <IoClose />
                    </Button>
                </header>

                <article className="content">
                    <div className="name">
                        <label htmlFor="create_name">스케줄명</label>
                        <input
                            type={'text'}
                            value={createData.name}
                            id="create_name"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setCreateData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div
                        className="station"
                        onClick={() =>
                            setCreateData({
                                ...createData,
                                stationSEQ: station?.seq as number,
                            })
                        }
                    >
                        <span>&lt;Station&gt;</span>
                        <div
                            className={
                                createData.stationSEQ === station?.seq
                                    ? 'station_content active'
                                    : 'station_content'
                            }
                        >
                            <p>name: {station?.name}</p>
                            <p>
                                상태:{' '}
                                {station?.status === 0 ? '대기중' : '실행중'}
                            </p>
                        </div>
                    </div>

                    <div className="mission">
                        <span>&lt;MissionList&gt;</span>
                        <ul>
                            {missions.length > 0 &&
                                missions.map((mission) => (
                                    <li
                                        className={
                                            createData.missionSEQ ===
                                            mission.seq
                                                ? 'active'
                                                : ''
                                        }
                                        key={mission.seq}
                                        onClick={() =>
                                            setCreateData({
                                                ...createData,
                                                missionSEQ: mission.seq,
                                            })
                                        }
                                    >
                                        <span>{mission.name}</span>
                                        <span>
                                            타입:
                                            {mission.type === 0
                                                ? '웨이포인트'
                                                : '그리드'}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </article>

                <article className="content_btn">
                    <Button type={'button'} onClick={resetScheudle}>
                        <span>취소</span>
                    </Button>

                    <Button type={'button'} onClick={createScheudle}>
                        <span>스케줄 등록</span>
                    </Button>
                </article>
            </NewSchduleWrqp>

            <div className="global_wrap"></div>
        </>
    )
}
