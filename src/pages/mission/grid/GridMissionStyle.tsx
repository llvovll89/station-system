import { styled } from 'styled-components'
import theme from '../../../styles/theme'

export const GridMissionWrap = styled.section`
    position: absolute;
    top: 16px;
    right: 86px;
    z-index: 1;
    width: 62px;
    height: 62px;
    background-color: ${theme.color.subBlack};
    border-radius: 5px;
    boxs-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    overflow: hidden;

    & .disabled {
        background-color: ${theme.color.green};
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

    .active {
        background-color: ${theme.color.primary};
    }
`
