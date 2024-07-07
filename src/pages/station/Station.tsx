import { useState } from 'react'
import { StationWrap } from './StationStyle'
import { StationList } from './list/StationList'
import { NewStation } from './NewStation'

interface StationProps {
    toggleStation: () => void
    setIsActive: React.Dispatch<React.SetStateAction<string>>
    map: naver.maps.Map | null
}

export const Station = ({ toggleStation, setIsActive, map }: StationProps) => {
    const [isCreateStation, setIsCreateStation] = useState(false)
    const [isHttpRequest, setIsHttpRequest] = useState(false)

    const toggleCreateStation = () => {
        setIsCreateStation((prev) => !prev)
    }

    return (
        <StationWrap>
            <StationList
                toggleStation={toggleStation}
                setIsActive={setIsActive}
                isHttpRequest={isHttpRequest}
                toggleCreateStation={toggleCreateStation}
                map={map}
            />

            {isCreateStation && (
                <NewStation
                    toggleCreateStation={toggleCreateStation}
                    setIsHttpRequest={setIsHttpRequest}
                />
            )}
        </StationWrap>
    )
}
