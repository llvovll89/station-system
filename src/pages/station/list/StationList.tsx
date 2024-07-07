import { IoClose } from 'react-icons/io5'
import { Button } from '../../../components/button/Button'
import { useEffect, useState } from 'react'
import { StationDto } from '../../../dto/Station'
import { IoCreateOutline } from 'react-icons/io5'
import { StationWrap } from './StationListStyle'
import { getStations } from '../../../util/requestHttp'

interface StationListProps {
    toggleStation: () => void
    setIsActive: React.Dispatch<React.SetStateAction<string>>
    isHttpRequest: boolean
    toggleCreateStation: () => void
    map: naver.maps.Map | null
}

export const StationList = ({
    toggleStation,
    setIsActive,
    isHttpRequest,
    toggleCreateStation,
    map,
}: StationListProps) => {
    const [stations, setStations] = useState<StationDto[]>([])
    const [selectedStation, setSelectedStation] = useState<StationDto | null>(
        null
    )

    const toggleActiveStation = () => {
        toggleStation()
        setIsActive('')
    }

    const selectStation = (station: StationDto) => {
        setSelectedStation(station)
        const coords = new naver.maps.LatLng(
            station.latitude,
            station.longitude
        )
        map && map.morph(coords, 16)
    }

    useEffect(() => {
        const fetchStation = async () => {
            const data = await getStations()
            setStations(data)
        }

        fetchStation()
    }, [isHttpRequest])

    return (
        <StationWrap>
            <header>
                <h1>스테이션</h1>

                <div className="btn_content">
                    <Button
                        type={'button'}
                        onClick={toggleCreateStation}
                        className="create_btn"
                    >
                        <IoCreateOutline />
                    </Button>

                    <Button type={'button'} onClick={toggleActiveStation}>
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
