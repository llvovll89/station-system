import styled from 'styled-components'
import theme from '../../../styles/theme'

export const ScheduleListWrap = styled.section`
    width: 350px;
    height: 100vh;
    position: absolute;
    left: 90px;
    top: 0;
    background-color: rgba(0, 0, 0, 0.88);

    & header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${theme.color.white};
        border-bottom: 1px solid rgba(255, 255, 255, 0.33);

        h1 {
            padding-left: 12px;
        }

        .content_btn {
            display: flex;
            align-items: center;
            padding-right: 12px;

            & button {
                width: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
`
