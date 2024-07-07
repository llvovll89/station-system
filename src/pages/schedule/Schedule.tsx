import { useState } from 'react'
import { StationDto } from '../../dto/Station'
import { ScheudleWrap } from './list/SchduleStyle'
import { ScheduleList } from './list/ScheduleList'
import { NewSchdule } from './NewSchedule'

interface ScheduleProps {
    toggleSchedule: () => void
    stations: StationDto[]
    setIsActive: React.Dispatch<React.SetStateAction<string>>
    isRunningSchedule: boolean
}

export const Schedule = ({
    toggleSchedule,
    isRunningSchedule,
    stations,
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
                isRunningSchedule={isRunningSchedule}
                toggleSchedule={toggleSchedule}
                toggleCreateSchedule={toggleCreateSchedule}
                setIsActive={setIsActive}
                isHttpRequest={isHttpRequest}
                setIsHttpRequest={setIsHttpRequest}
            />

            {isCreateSchedule && (
                <NewSchdule
                    toggleCreateSchedule={toggleCreateSchedule}
                    stations={stations}
                    setIsHttpRequest={setIsHttpRequest}
                />
            )}
        </ScheudleWrap>
    )
}
