import { IoClose } from 'react-icons/io5'
import { Button } from '../../../components/button/Button'
import { useEffect, useState } from 'react'
import { StationDto } from '../../../dto/Station'
import axios from 'axios'
import { STATION } from '../../../constant/http'
import { IoCreateOutline } from 'react-icons/io5'
import { StationWrap } from './StationListStyle'

interface StationListProps {
    toggleStation: () => void
}

export const StationList = ({ toggleStation }: StationListProps) => {
    const [stations, setStations] = useState<StationDto[]>([])
    const [isHttpRequest, setIsHttpRequest] = useState(false)
    const [selectedStation, setSelectedStation] = useState<StationDto | null>(
        null
    )

    const createStation = async () => {
        const name = localStorage.getItem('user')

        const params = {
            name,
            latitude: '',
            longitude: '',
            drone: {
                name: 'm30t',
                latitude: '',
                longitude: '',
            },
        }

        try {
            const response = await axios.post(STATION, params, {
                withCredentials: true,
            })
            const data = await response.data
            console.log(data)
            setIsHttpRequest((prev) => !prev)
        } catch (err) {
            console.log(err)
        }
    }

    const selectStation = (station: StationDto) => {
        setSelectedStation(station)
        // getDockMarker(station)
    }

    // const getDockMarker = (station: StationDto) => {
    //     const { latitude, longitude } = station
    //     const dockMarker = new naver.maps.Marker({
    //         map: (document.getElementById('map') as any) || naver.maps.Map,
    //         position: new naver.maps.LatLng(latitude, longitude),
    //         icon: {
    //             content: `<div class='dock_marker'><span>D</span></div>`,
    //             anchor: new naver.maps.Point(16, 16),
    //         },
    //     })

    //     console.log(station)
    //     console.log(dockMarker)
    // }

    const getStation = async () => {
        try {
            const response = await axios.get(STATION, { withCredentials: true })
            const data = await response.data

            if (response.status === 200) {
                setStations(data)
                console.log(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStation()
    }, [isHttpRequest])

    return (
        <StationWrap>
            <header>
                <h1>스테이션</h1>

                <div className="btn_content">
                    <Button
                        type={'button'}
                        onClick={createStation}
                        className="create_btn"
                    >
                        <IoCreateOutline />
                    </Button>

                    <Button type={'button'} onClick={toggleStation}>
                        <IoClose />
                    </Button>
                </div>
            </header>

            <article className="container">
                {stations.map((station) => (
                    <section
                        className={`content ${selectedStation === station ? 'selected' : ''}`}
                        key={station.seq}
                        onClick={() => selectStation(station)}
                    >
                        <div className="content_header">
                            <h1>{station.name}</h1>
                        </div>

                        <div className="content_body">
                            <div>
                                <span>상태: </span>
                                <span
                                    className={
                                        station.status === 0 ? 'idle' : 'active'
                                    }
                                >
                                    {station.status === 0
                                        ? ' 대기중'
                                        : ' 작동중'}
                                </span>
                            </div>
                            <div className="coords">
                                <span>
                                    위도: {Number(station.latitude.toFixed(6))}
                                </span>
                                <span>
                                    경도: {Number(station.longitude.toFixed(6))}
                                </span>
                            </div>
                        </div>

                        <div className="content_drone">
                            <div className="drone">
                                <span>드론: </span>
                                <span className="name">
                                    {station.drone.name}
                                </span>
                            </div>
                        </div>
                    </section>
                ))}
            </article>
        </StationWrap>
    )
}
