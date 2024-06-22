import styled from 'styled-components'
import theme from '../../styles/theme'

export const MissionWrap = styled.section`
    & .create_btn {
        width: 62px;
        height: 62px;
        border-radius: 5px;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.22);
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: ${theme.color.subBlack};
        flex-direction: column;
        gap: 4px;
    }

    & .init_btn {
        position: absolute;
        top: 156px;
        right: 86px;
        z-index: 1;
        width: 62px;
        height: 62px;
        background-color: ${(props) => props.theme.color.subBlack};
        border-radius: 5px;
        boxs-shadow: ${theme.boxShadow?.lg};
        flex-direction: column;
        gap: 4px;

        & span {
            font-size: 12px;
            font-weight: bold;
        }
    }

    & .waypoint_content {
        position: absolute;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.8rem 1.5rem;
        background-color: ${theme.color.subBlack};
        border-radius: 5px;
        color: ${theme.color.white};
        display: flex;
        gap: 1rem;
        align-items: center;
        min-width: 300px;

        & .content {
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 180px;
        }

        & .btn_box {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .submit_btn {
                background-color: ${theme.color.primary};
                min-width: 100px;
                border-radius: 5px;
            }
        }
    }
`
