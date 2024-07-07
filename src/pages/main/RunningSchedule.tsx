import styled from 'styled-components'
import theme from '../../styles/theme'

const RunningScheduleWrap = styled.section`
    position: absolute;
    top: 16px;
    left: 50%;
    border-radius: 5px;
    padding: 0.7rem 1.25rem;
    background-color: ${theme.color.black};
    color: ${theme.color.primary};
    transform: translateX(-50%);
`

export const RunningSchedule = () => {
    return (
        <RunningScheduleWrap>
            <h1>스케줄 진행 중 ...</h1>
        </RunningScheduleWrap>
    )
}
