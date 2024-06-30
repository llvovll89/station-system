import { useState } from 'react'
import { StationWrap } from './StationStyle'
import { StationList } from './list/StationList'
import { NewStation } from './NewStation'

interface StationProps {
    toggleStation: () => void
    setIsActive: React.Dispatch<React.SetStateAction<string>>
}

export const Station = ({ toggleStation, setIsActive }: StationProps) => {
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
