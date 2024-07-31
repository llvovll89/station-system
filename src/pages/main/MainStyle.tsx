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

    & .running_schedule {
        position: absolute;
        top: 16px;
        left: 50%;
        border-radius: 5px;
        padding: 0.7rem 1.25rem;
        background-color: ${theme.color.black};
        color: ${theme.color.white};
        transform: translateX(-50%);
        box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.33);
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

    & .area_size {
        padding: 0.75rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 16px;
        border-radius: 5px;
        box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.26);
        background-color: ${theme.color.black};
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

    & .edit_marker {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid ${theme.color.primary};
        background-color: ${theme.color.white};
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
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.color.white};
        background-color: ${theme.color.white};
        border-radius: 50%;
        border: 2px solid ${theme.color.primary};
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
        color: ${theme.color.black};
    }

    & .points_marker {
        width: 26px;
        height: 26px;
        border-radius: 100%;
        border: 3px solid #231f20;
        background-color: #3772f0;
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

    & .bg_wrap {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.32);
        width: 100vw;
        height: 100vh;
    }
`
