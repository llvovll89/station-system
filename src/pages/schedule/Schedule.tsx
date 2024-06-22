import { ScheudleWrap } from './list/SchduleStyle'
import { ScheduleList } from './list/ScheduleList'

interface ScheduleProps {
    toggleSchedule: () => void
}

export const Schedule = ({ toggleSchedule }: ScheduleProps) => {
    return (
        <ScheudleWrap>
            <ScheduleList toggleSchedule={toggleSchedule} />
        </ScheudleWrap>
    )
}
