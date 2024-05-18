import styled from "styled-components";
import theme from "../../styles/theme";

export const MapWrap = styled.section`
    & #map {
        width: calc(100vw-66px);
        height: 100vh;
        margin: 0 0 0 66px;
    }

    & .overlay_container {
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        z-index: 20;
        color: ${theme.color.black};
        background-color: ${theme.color.white};
        padding: 1rem;

        & .btn_container {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 2px;

            & button {
                width: 100%;
                height: 36px;
                border: 1px solid ${theme.color.black};
                cursor: pointer;
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