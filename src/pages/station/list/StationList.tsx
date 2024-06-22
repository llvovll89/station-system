import { IoClose } from 'react-icons/io5'
import { Button } from '../../../components/button/Button'
import { useEffect, useState } from 'react'
import { mockStation as initialMockStation } from '../Mock'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'
import { Station } from '../../../dto/Station'
import axios from 'axios'
import { STATION } from '../../../constant/http'
import { StationWrap } from './StationListStyle'

interface StationListProps {
    toggleStation: () => void
}

export const StationList = ({ toggleStation }: StationListProps) => {
    const [stations, setStations] = useState<Station[]>([])
    const [selectedStation, setSelectedStation] = useState<Station | null>(null)

    const selectStation = (station: Station) => {
        setSelectedStation(station)
        getDockMarker(station)
    }

    const toggleIsOpen = () => {
        setSelectedStation(null)
    }

    const stationControlProps = () => ({
        selectedStation,
        toggleIsOpen,
    })

    const editStation = (station: Station) => {
        console.log(station)
    }

    const deleteStation = (station: Station, index: number) => {
        if (window.confirm('정말 삭제 하시겠습니까?')) {
            const updatedStations = stations.filter((_, i) => i !== index)
            setStations(updatedStations)

            if (selectedStation && selectedStation.seq === station.seq) {
                setSelectedStation(null)
                console.log(selectedStation)
            }
        }
    }

    const getDockMarker = (station: Station) => {
        const { latitude, longitude } = station
        new naver.maps.Marker({
            map: (document.getElementById('map') as any) || naver.maps.Map,
            position: new naver.maps.LatLng(latitude, longitude),
        })
    }

    const getStation = async () => {
        setStations(initialMockStation)

        try {
            const response = await axios.get(STATION)
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
    }, [])

    return (
        <StationWrap>
            <header>
                <h1>스테이션</h1>

                <Button type={'button'} onClick={toggleStation}>
                    <IoClose />
                </Button>
            </header>

            <article className="container">
                {stations.map((station, index) => (
                    <section
                        className={`content ${selectedStation === station ? 'selected' : ''}`}
                        key={station.seq}
                        onClick={() => selectStation(station)}
                    >
                        <div className="content_header">
                            <h1>{station.name}</h1>
                            <div className="content_header_items">
                                <button onClick={() => editStation(station)}>
                                    <CiEdit />
                                </button>
                                <button
                                    onClick={() =>
                                        deleteStation(station, index)
                                    }
                                >
                                    <MdOutlineDelete />
                                </button>
                            </div>
                        </div>
                    </section>
                ))}
            </article>
        </StationWrap>
    )
}
