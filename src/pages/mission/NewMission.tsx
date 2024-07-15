import styled from 'styled-components'
import theme from '../../styles/theme'
import { Button } from '../../components/button/Button'
import React, { useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { MissionDto } from '../../dto/MissionDto'
// import { MissionType } from '../../constant/type'

const NewMissionWrap = styled.article`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 400px;
    padding: 1.8rem 1.6rem;
    background-color: ${theme.color.black};
    border-radius: 5px;
    box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.3);
    color: ${theme.color.white};
    display: flex;
    flex-direction: column;
    gap: 2rem;
    z-index: 10;

    & header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & span {
            font-size: 20px;
            font-weight: bold;
        }

        & button {
            width: 32px;
            height: 32px;
        }
    }

    & .content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        & .content_header {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            & input {
                height: 42px;
                border-radius: 5px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                padding: 0 12px;
                color: ${theme.color.white};
            }
        }

        & .content_mission {
            display: flex;
            gap: 6px;
            align-items: center;
            width: 100%;

            & .area {
                min-width: 100px;
                width: 100%;
                transition: all 0.15s linear;

                & button {
                    border-radius: 5px;
                    border: 1px solid rgba(255, 255, 255, 0.22);
                }

                &.active {
                    & button {
                        background-color: ${theme.color.primary};
                        color: ${theme.color.white};
                        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.21);
                    }
                }
            }
        }
    }

    & .btn_box {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 6px;

        & button {
            border-radius: 5px;
            &:first-child {
                background-color: ${theme.color.white};
                color: ${theme.color.black};
            }

            &:last-child {
                background-color: ${theme.color.primary};
            }
        }
    }
`

interface NewMissionProps {
    setIsCreateMission: React.Dispatch<React.SetStateAction<boolean>>
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
    missionData: MissionDto
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
}

export const NewMission = ({
    isRunningMission,
    missionData,
    setIsCreateMission,
    setIsRunningMission,
    setMissionData,
}: NewMissionProps) => {
    const closeNewMission = () => {
        setIsRunningMission({
            waypoint: false,
            grid: false,
            isStart: false,
        })
        setIsCreateMission(false)
    }

    const createMission = () => {
        setIsRunningMission(
            (prev: { waypoint: boolean; grid: boolean; isStart: boolean }) => ({
                ...prev,
                isStart: true,
            })
        )

        setIsCreateMission(false)
    }

    useEffect(() => {
        setIsRunningMission((prevMission) => ({
            ...prevMission,
            waypoint: false,
            grid: false,
        }))
    }, [])

    return (
        <>
            <NewMissionWrap>
                <header>
                    <h1>미션 생성</h1>
                    <Button type="button" onClick={closeNewMission}>
                        <IoClose style={{ width: '24px', height: '24px' }} />
                    </Button>
                </header>

                <div className="content">
                    <div className="content_header">
                        <label htmlFor="name">미션 이름</label>
                        <input
                            type="text"
                            name="name"
                            onChange={(e) =>
                                setMissionData({
                                    ...missionData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="content_mission">
                        <div
                            className={
                                isRunningMission.waypoint
                                    ? 'area active'
                                    : 'area'
                            }
                        >
                            <Button
                                type="button"
                                onClick={() =>
                                    setIsRunningMission(
                                        (prev: {
                                            waypoint: boolean
                                            grid: boolean
                                            isStart: boolean
                                        }) => ({
                                            ...prev,
                                            waypoint: !prev.waypoint,
                                            grid: false,
                                        })
                                    )
                                }
                            >
                                <span>웨이포인트</span>
                            </Button>
                        </div>

                        <div
                            className={
                                isRunningMission.grid ? 'area active' : 'area'
                            }
                        >
                            <Button
                                type="button"
                                onClick={() =>
                                    setIsRunningMission(
                                        (prev: {
                                            waypoint: boolean
                                            grid: boolean
                                            isStart: boolean
                                        }) => ({
                                            ...prev,
                                            waypoint: false,
                                            grid: !prev.grid,
                                        })
                                    )
                                }
                            >
                                <span>폴리곤</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="btn_box">
                    <Button type="button" onClick={closeNewMission}>
                        <span>취소</span>
                    </Button>
                    <Button type="button" onClick={createMission}>
                        <span>선택</span>
                    </Button>
                </div>
            </NewMissionWrap>

            <div className="bg_wrap"></div>
        </>
    )
}
