import styled from 'styled-components'
import theme from '../../styles/theme'
import { Button } from '../../components/button/Button'
import { IoClose } from 'react-icons/io5'
import { useState } from 'react'
import { CreateStation } from '../../constant/type'
import { STATION } from '../../constant/http'
import axios from 'axios'

const NewStationWrap = styled.section`
    position: absolute;
    min-width: 450px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    padding: 1.5rem 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: rgb(31, 30, 37);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 50;
    color: ${theme.color.white};

    & header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & h1 {
            font-size: 22px;
            color: ${theme.color.white};
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

    & .content {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;

        & label {
            width: 100px;
        }

        & input {
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            height: 100%;
            width: 100%;
            padding: 0 3px 0 1rem;
            color: ${theme.color.white};
            background-color: #181818;

            &:focus {
                color: ${theme.color.primary};
                border: 1px solid ${theme.color.primary};
            }
        }

        & .name,
        & .item {
            display: flex;
            height: 32px;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
        }

        & .content_body {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            & .station,
            & .drone {
                width: 100%;
                gap: 1rem;
                display: flex;
                flex-direction: column;

                & .header {
                    display: flex;
                    align-items: center;

                    & span {
                        font-weight: 700;
                    }
                }
            }

            & .drone_content,
            & .station_content {
                width: 100%;
                align-items: center;
                gap: 0.5rem;
                display: flex;
                flex-direction: column;
            }
        }

        & .content_btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            & button {
                width: 100%;
                height: 52px;
                border-radius: 5px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                background-color: #181818;

                &:hover {
                    background-color: ${theme.color.primary};
                }
            }
        }
    }
`

interface NewStationProps {
    toggleCreateStation: () => void
    setIsHttpRequest: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewStation = ({
    toggleCreateStation,
    setIsHttpRequest,
}: NewStationProps) => {
    const [createData, setCreateData] = useState<CreateStation>({
        name: 'Untitle Station',
        latitude: 0,
        longitude: 0,
        drone: {
            name: '',
            latitude: 0,
            longitude: 0,
        },
    })

    const createStation = async () => {
        if (
            createData.name === '' ||
            createData.latitude === 0 ||
            createData.longitude === 0
        ) {
            alert('스테이션 정보를 입력해 주세요.')
            return
        }

        if (
            createData.drone.name === '' ||
            createData.drone.latitude === 0 ||
            createData.drone.longitude === 0
        ) {
            alert('드론 정보를 입력해 주세요.')
            return
        }

        try {
            const response = await axios.post(STATION, createData, {
                withCredentials: true,
            })
            const data = await response.data
            console.log(data)
            setIsHttpRequest((prev) => !prev)
        } catch (err) {
            console.log(err)
        }
    }

    const resetToggleStation = () => {
        toggleCreateStation()
        setCreateData({
            name: '',
            latitude: 0,
            longitude: 0,
            drone: {
                name: '',
                latitude: 0,
                longitude: 0,
            },
        })
    }

    return (
        <>
            <NewStationWrap>
                <header>
                    <h1>스테이션 추가</h1>
                    <Button type={'button'} onClick={toggleCreateStation}>
                        <IoClose />
                    </Button>
                </header>

                <article className="content">
                    <div className="name">
                        <label htmlFor="create_name">스테이션명</label>
                        <input
                            type={'text'}
                            value={createData.name}
                            autoComplete="off"
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

                    <div className="content_body">
                        <section className="station">
                            <div className="header">
                                <span>STATION</span>
                            </div>

                            <div className="station_content">
                                <div className="item">
                                    <label htmlFor="station_latitude">
                                        위도
                                    </label>
                                    <input
                                        type={'number'}
                                        value={createData.latitude}
                                        id="station_latitude"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setCreateData((prev) => ({
                                                ...prev,
                                                latitude: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="item">
                                    <label htmlFor="station_longitude">
                                        경도
                                    </label>
                                    <input
                                        type={'number'}
                                        value={createData.longitude}
                                        id="station_longitude"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setCreateData((prev) => ({
                                                ...prev,
                                                longitude: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="drone">
                            <div className="header">
                                <span>DRONE</span>
                            </div>

                            <div className="drone_content">
                                <div className="item">
                                    <label htmlFor="drone_name">드론명</label>
                                    <input
                                        type={'text'}
                                        value={createData.drone.name}
                                        id="drone_name"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setCreateData((prev) => ({
                                                ...prev,
                                                drone: {
                                                    ...prev.drone,
                                                    name: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="item">
                                    <label htmlFor="drone_latitude">
                                        드론위도
                                    </label>
                                    <input
                                        type={'number'}
                                        value={createData.drone.latitude}
                                        id="drone_latitude"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setCreateData((prev) => ({
                                                ...prev,
                                                drone: {
                                                    ...prev.drone,
                                                    latitude: Number(
                                                        e.target.value
                                                    ),
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="item">
                                    <label htmlFor="drone_longitude">
                                        드론경도
                                    </label>
                                    <input
                                        type={'number'}
                                        value={createData.longitude}
                                        id="drone_longitude"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setCreateData((prev) => ({
                                                ...prev,
                                                drone: {
                                                    ...prev.drone,
                                                    longitude: Number(
                                                        e.target.value
                                                    ),
                                                },
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="content_btn">
                        <Button type={'button'} onClick={resetToggleStation}>
                            취소
                        </Button>
                        <Button type={'button'} onClick={createStation}>
                            생성
                        </Button>
                    </div>
                </article>
            </NewStationWrap>

            <div className="global_wrap"></div>
        </>
    )
}
