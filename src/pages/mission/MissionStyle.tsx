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

        & span {
            &.active {
                color: ${theme.color.primary};
            }
        }
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
        padding: 1.5rem;
        background-color: ${theme.color.subBlack};
        border-radius: 5px;
        color: ${theme.color.white};
        min-width: 300px;
        box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.33);

        & .content {
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 300px;

            .overlay_info {
                & span {
                    width: 100%;
                }
            }

            & div {
                display: flex;
                gap: 6px;
                align-items: center;

                & label {
                    width: 50px;
                }

                & .name {
                    width: 100%;
                    border-radius: 5px;
                    border: 1px solid ${theme.color.subPrimary};
                    color: ${theme.color.white};
                    padding: 0 0.35rem;
                    height: 32px;
                }
            }
        }

        & .btn_box {
            display: flex;
            gap: 4px;

            & button {
                height: 32px;
            }

            & .submit_btn {
                background-color: ${theme.color.primary};
                min-width: 100px;
                border-radius: 5px;
            }
        }
    }
`
