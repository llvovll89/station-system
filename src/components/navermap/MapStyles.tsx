import styled from "styled-components";
import theme from "../../styles/theme";

export const MapWrap = styled.section`
    & #map {
        width: 100%;
        height: 100vh;
    }

    & .overlay_container {
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: absolute;
        left: 50%;
        top: 12px;
        transform: translate(-50%);
        z-index: 20;
        color: ${theme.color.black};
        background-color: ${theme.color.white};
        padding: 1rem;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.33);
        border-radius: 5px;

        &. mission_type {
            color: ${theme.color.black};
        }

        & .content {
            display: flex;
            gap: 0.5rem;

            & .distance, & .markers {
                & span {
                    &:first-child {
                        font-size: ${theme.fontSize.sm};
                        padding-right: 0.5rem;
                    }

                    &:last-child {
                        font-weight: bold;
                    }
                }
            }
        }

        & .btn_container {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 2px;

            & button {
                width: 100%;
                height: 36px;
                cursor: pointer;
                color: ${theme.color.white};
                background-color: ${theme.color.black};
            }
        }
    }

    & .wayline_marker {
        background-color: ${theme.color.black};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: ${theme.color.white};
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #09f;
    }
`