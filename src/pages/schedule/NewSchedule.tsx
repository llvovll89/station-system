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
    min-width: 500px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: rgb(31, 30, 37);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 50;
    color: ${theme.color.white};

    & header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & h2 {
            font-size: 22px;
            font-weight: bold;
        }

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
            gap: 0.5rem;

            & input {
                height: 42px;
                border: 1px solid rgba(255,2525,255, 0.26);
                padding: 0 0.52rem;
                color: ${theme.color.white};
                border-radius: 5px;
                background-color: #181818;
                transition: all 0.15s linear;

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
            background-color: #181818;

            & span {
                font-weight: bold;
                
                &.title {
                    text-align: center;
                    display: inline-block;
                    width: 100%;
                    padding: 0.5rem; 0;
                }
            }

            & p {
                font-size: 14px;
            }
        }

        & .station {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            padding: 0.5rem;

            & ul {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            & .station_content {
                padding: 1rem 0.75rem;  
                border-radius: 5px;
                background-color: ${theme.color.green};

                &:hover {
                    color: ${theme.color.primary};
                }
                
                &.active {
                    background-color: ${theme.color.primary};
                    color: ${theme.color.white};
                }

                & .station_items {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    
                    &:first-child {
                        gap: 0.75rem;
                        justify-content: flex-start;
                    }
                    
                }
            }
        }

        & .mission {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            padding: 0.5rem;

            & ul {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding: 0.5rem;

                & li {
                    cursor: pointer;
                    padding: 1rem 0.75rem;  
                    border-radius: 5px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    background-color: ${theme.color.green};

                    &:hover {
                        color: ${theme.color.primary};
                    }

                    &.active {
                        background: ${theme.color.primary};
                        color: ${theme.color.white};
                    }

                    &:last-child {
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
            background-color: #181818;
            transition: all 0.15s linear;

            &:hover {
                background-color: ${theme.color.primary};
            }
        }
    }
`

interface NewSchduleProps {
    toggleCreateSchedule: () => void
    stations: StationDto[]
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewSchdule = ({
    toggleCreateSchedule,
    stations,
    setIsHttpRequest,
}: NewSchduleProps) => {
    const [missions, setMissions] = useState<MissionDto[]>([])
    const [createData, setCreateData] = useState({
        name: 'Untitile Schedule',
        stationSeq: 0,
        missionSeq: 0,
    })

    const createScheudle = async () => {
        if (createData.name === '') {
            alert('스케줄 명을 입력해 주세요!')
            return
        }

        if (createData.stationSeq === 0) {
            alert('스테이션을 선택해 주세요!')
            return
        }

        if (createData.missionSeq === 0) {
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
            toggleCreateSchedule()
        } catch (error) {
            console.log(error)
        }
    }

    const resetScheudle = () => {
        setCreateData({
            name: '',
            stationSeq: 0,
            missionSeq: 0,
        })

        toggleCreateSchedule()
    }

    const getMission = async () => {
        try {
            const response = await axios.get(MISSION, { withCredentials: true })
            const data = await response.data
            console.log(data)
            setMissions(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const fetchInfoMission = async () => {
            try {
                const response = await axios.get(
                    `${MISSION}/${createData.missionSeq}`,
                    {
                        withCredentials: true,
                    }
                )

                console.log('missionInfo', response.data)
                sessionStorage.setItem('missionInfo', JSON.stringify(response))
            } catch (error) {
                console.log(error)
            }
        }

        fetchInfoMission()
    }, [createData.missionSeq])

    useEffect(() => {
        getMission()
        console.log('stations:', stations)
    }, [])

    return (
        <>
            <NewSchduleWrqp>
                <header>
                    <h1>스케줄 추가 </h1>
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
                    <div className="station">
                        <span className="title">&lt;스테이션&gt;</span>
                        <ul>
                            {stations.length > 0 &&
                                stations.map((station, index) => (
                                    <li
                                        className={
                                            createData.stationSeq ===
                                            station?.seq
                                                ? 'station_content active'
                                                : 'station_content'
                                        }
                                        onClick={() =>
                                            setCreateData({
                                                ...createData,
                                                stationSeq:
                                                    station?.seq as number,
                                            })
                                        }
                                        key={station.seq}
                                    >
                                        <div className="station_items">
                                            <span>[{index + 1}]</span>
                                            <span>{station.name}</span>
                                        </div>
                                        <div className="station_items">
                                            <span>드론명</span>
                                            <span>{station.drone.name}</span>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="mission">
                        <span className="title">&lt;미션리스트&gt;</span>
                        <ul>
                            {missions.length > 0 &&
                                missions.map((mission) => (
                                    <li
                                        className={
                                            createData.missionSeq ===
                                            mission.seq
                                                ? 'active'
                                                : ''
                                        }
                                        key={mission.seq}
                                        onClick={() =>
                                            setCreateData({
                                                ...createData,
                                                missionSeq: mission.seq,
                                            })
                                        }
                                    >
                                        <span>미션명: {mission.name}</span>
                                        <span>
                                            타입:
                                            {mission.type === 0
                                                ? ' 웨이포인트'
                                                : ' 그리드'}
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
