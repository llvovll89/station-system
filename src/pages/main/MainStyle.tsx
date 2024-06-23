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
`
