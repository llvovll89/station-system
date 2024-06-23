import { styled } from 'styled-components'
import theme from '../../../styles/theme'

// export const WaypointWrap = styled.section`
export const WaypointWrap = styled.section`
    position: absolute;
    top: 86px;
    right: 86px;
    z-index: 1;
    width: 62px;
    height: 62px;
    border-radius: 5px;
    boxs-shadow: ${theme.boxShadow?.lg};
    background-color: ${theme.color.black};
    overflow: hidden;

    & button {
        width: 100%;
        height: 100%;
        flex-direction: column;
        gap: 4px;

        span {
            font-size: 14px;
        }
    }

    .active {
        background-color: ${theme.color.primary};
    }
`
