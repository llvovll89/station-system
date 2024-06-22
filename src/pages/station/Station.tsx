import { StationWrap } from './StationStyle'
import { StationList } from './list/StationList'

interface StationProps {
    toggleStation: () => void
}

export const Station = ({ toggleStation }: StationProps) => {
    return (
        <StationWrap>
            <StationList toggleStation={toggleStation} />
        </StationWrap>
    )
}
