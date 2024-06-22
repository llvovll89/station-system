import { IoClose } from 'react-icons/io5'
import { ScheduleListWrap } from './ScheduleListSyle'
import { Button } from '../../../components/button/Button'

interface ScheduleListProps {
    toggleSchedule: () => void
}

export const ScheduleList = ({ toggleSchedule }: ScheduleListProps) => {
    return (
        <ScheduleListWrap>
            <header>
                <h1>스케줄</h1>

                <Button type={'button'} onClick={toggleSchedule}>
                    <IoClose />
                </Button>
            </header>

            <article className="container"></article>
        </ScheduleListWrap>
    )
}
