import { IoClose } from 'react-icons/io5'
import { Button } from '../../../components/button/Button'
import { styled } from 'styled-components'
import { useEffect, useState } from 'react'
import { mockStation } from '../Mock'
import theme from '../../../styles/theme'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'
import { Station } from '../../../dto/Station'
import { StationControl } from '../StationContol'

const StationWrap = styled.section`
    width: 300px;
    height: 100vh;
    position: absolute;
    left: 64px;
    top: 0;
    background-color: ${theme.color.subBlack};

    & header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${theme.color.white};
        border-bottom: 1px solid rgba(255, 255, 255, 0.33);

        h1 {
            padding-left: 12px;
        }

        button {
            width: 52px;
        }
    }

    & .container {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        padding: 0.8rem 1rem;

        .content {
            background-color: ${theme.color.white};
            padding: 0.5rem 0.7rem;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            border-radius: 4px;
            border: 2px solid ${theme.color.white};
            transition: all 0.3s ease-in-out;
            cursor: pointer;

            &.selected {
                background-color: #2eb573;
                color: ${theme.color.white};
                // border: 2px solid ${theme.color.primary};
            }

            & .content_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.5rem;
                padding: 0;

                & .content_header_items {
                    display: flex;

                    button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        cursor: pointer;
                    }
                }
            }

            & .content_body {
                display: flex;
                flex-direction: column;

                & .content_desc {
                    font-size: 0.9rem;
                }

                & .content_sn {
                    display: flex;
                    flex-direction: column;

                    & div {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;

                        & span {
                            font-size: 0.8rem;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
`

interface StationListProps {
    toggleStation: () => void
}

export const StationList = ({ toggleStation }: StationListProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedStation, setSelectedStation] = useState<Station | null>(null)

    const selectStation = (station: Station) => {
        setSelectedStation(station)
        setIsOpen(true)
    }

    const toggleIsOpen = () => {
        setIsOpen(false)
        setSelectedStation(null)
    }

    const stationControlProps = () => ({
        selectedStation,
        toggleIsOpen,
    })

    const editStation = (station: Station) => {
        console.log(station)
    }

    const getStation = async () => {
        console.log('getStation')
        // try {
        //     // const response = await axios.get()
        //     // const data = await response.data

        //     // if(response.status === 200) {
        //     //     setStationList(data)
        //     //     console.log(data)
        //     // }
        // } catch (error) {
        //     console.log(error)
        // }
    }

    useEffect(() => {
        getStation()
    }, [])

    return (
        <>
            {isOpen && <StationControl {...stationControlProps()} />}
            <StationWrap>
                <header>
                    <h1>스테이션</h1>

                    <Button type={'button'} onClick={toggleStation}>
                        <IoClose />
                    </Button>
                </header>

                <article className="container">
                    {mockStation.map((station) => (
                        <section
                            className={`content ${selectedStation === station ? 'selected' : ''}`}
                            key={station.seq}
                            onClick={() => selectStation(station)}
                        >
                            <div className="content_header">
                                <h1>{station.name}</h1>
                                <div className="content_header_items">
                                    <button
                                        onClick={() => editStation(station)}
                                    >
                                        <CiEdit />
                                    </button>
                                    <button>
                                        <MdOutlineDelete />
                                    </button>
                                </div>
                            </div>
                            <div className="content_body">
                                <div className="content_desc">
                                    <p>{station.description}</p>
                                </div>
                                <div className="content_sn">
                                    <div>
                                        <span>dockSN:</span>
                                        <span>{station.dockSn}</span>
                                    </div>
                                    <div>
                                        <span>droneSN:</span>
                                        <span>{station.droneSn}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </article>
            </StationWrap>
        </>
    )
}