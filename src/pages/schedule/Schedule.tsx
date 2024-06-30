import { useState } from 'react'
import { StationDto } from '../../dto/Station'
import { ScheudleWrap } from './list/SchduleStyle'
import { ScheduleList } from './list/ScheduleList'
import { NewSchdule } from './NewSchedule'

interface ScheduleProps {
    toggleSchedule: () => void
    station: StationDto | null
    setIsActive: React.Dispatch<React.SetStateAction<string>>
}

export const Schedule = ({
    toggleSchedule,
    station,
    setIsActive,
}: ScheduleProps) => {
    const [isCreateSchedule, setIsCreateSchedule] = useState(false)
    const [isHttpRequest, setIsHttpRequest] = useState(false)

    const toggleCreateSchedule = () => {
        setIsCreateSchedule((prev) => !prev)
    }

    return (
        <ScheudleWrap>
            <ScheduleList
                toggleSchedule={toggleSchedule}
                toggleCreateSchedule={toggleCreateSchedule}
                setIsActive={setIsActive}
                isHttpRequest={isHttpRequest}
                setIsHttpRequest={setIsHttpRequest}
            />

            {isCreateSchedule && (
                <NewSchdule
                    toggleCreateSchedule={toggleCreateSchedule}
                    station={station}
                    setIsHttpRequest={setIsHttpRequest}
                />
            )}
        </ScheudleWrap>
    )
}
