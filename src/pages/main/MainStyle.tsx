import styled from 'styled-components'
import theme from '../../styles/theme'

export const MainWrap = styled.section`
    position: relative;
    width: 100vw;
    min-height: 100vh;

    & #map {
        width: 100vw;
        height: 100vh;
    }

    & .delete_marker {
        background-color: ${theme.color.subBlack};
        color: ${theme.color.white};
        padding: 0.3rem 0.75rem;
        font-size: 12px;
        border-radius: 5px;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .marker {
        width: 24px;
        height: 24px;
        border-radius: 5px;
        background-color: ${theme.color.deepKoamaru};
        border: 1px solid #fefefe;
        justify-content: center;
        align-items: center;
        display: flex;
        color: ${theme.color.white};
    }

    & .distance {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 12px;
        color: ${theme.color.subWhite};
        background-color: ${theme.color.black};
        padding: 0.5rem 1rem;
    }

    .create_mission_btn {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 1;
        width: 52px;
        height: 52px;
        background-color: ${(props) => props.theme.color.subBlack};
    }

    & .start_marker,
    & .end_marker {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: ${theme.color.white};
        border: 2px solid ${theme.color.primary};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.color.black};
    }

    & .waypoint_marker {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        border: 2px solid ${theme.color.primary};
        background-color: ${theme.color.white};
        color: ${theme.color.black};
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .wayline_marker {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.color.white};
        background-color: ${theme.color.primary};
        border-radius: 5px;
        border: 1px solid ${theme.color.subWhite};
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .points_marker {
        width: 26px;
        height: 26px;
        border-radius: 100%;
        border: 3px solid ${theme.color.primary};
        background-color: ${theme.color.white};
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .dock_marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        border: 3px solid ${theme.color.primary};
        background-color: #231f20;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);

        & span {
            color: ${theme.color.white};
            font-size: 12px;
            font-weight: bold;
        }
    }

    & .drone_marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        border: 3px solid ${theme.color.green};
        background-color: #231f20;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);

        & span {
            color: ${theme.color.white};
            font-size: 12px;
            font-weight: bold;
        }
    }

    .global_wrap {
        width: 100vw;
        height: 100vh;
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.33);
        z-index: 10;
    }
`
