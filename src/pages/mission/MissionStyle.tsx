import styled from "styled-components";
import theme from "../../styles/theme";

export const MissionWrap = styled.section`
    position: relative;
    width: 100%;
    height: 100%;

    & .create_mission {
        position: absolute;
        cursor: pointer;
        top: 76px;
        right: 16px;
        width: 42px;
        height: 42px;
        border-radius: 4px;
        box-shadow: 0 2px 2px 2px rgba(0,0,0,0.22);
        background-color: ${theme.color.white};
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${theme.color.black};
        font-weight: bold;
    }

    & .init_mission {
        position: absolute;
        cursor: pointer;
        top: 128px;
        right: 16px;
        width: 42px;
        height: 42px;
        border-radius: 4px;
        box-shadow: 0 2px 2px 2px rgba(0,0,0,0.22);
        background-color: ${theme.color.white};
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${theme.color.black};
        font-weight: bold;
    }

    & .mission_type {
        display: inline-block;
        text-align: center;
        font-size: ${theme.fontSize.lg};
        background: ${theme.color.black};
        border-radius: 3px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        color: ${theme.color.white};
        padding: 0.5rem 1rem;
        min-width: 120px;
    }
`