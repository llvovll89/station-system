import { styled } from 'styled-components'
import theme from '../../../styles/theme'

interface WaypointWrapProps {
    isStartWaypoint: boolean
}

export const WaypointWrap = styled.section<WaypointWrapProps>`
    position: absolute;
    top: 86px;
    right: 86px;
    z-index: 1;
    width: 62px;
    height: 62px;
    background-color: ${(props) =>
        props.isStartWaypoint
            ? theme.color.primary
            : props.theme.color.subBlack};
    border-radius: 5px;
    boxs-shadow: ${theme.boxShadow?.lg};

    & .active {
        background-color: ${theme.color.primary};
    }

    & button {
        width: 100%;
        height: 100%;
        flex-direction: column;
        gap: 4px;

        span {
            font-size: 14px;
        }
    }
`
