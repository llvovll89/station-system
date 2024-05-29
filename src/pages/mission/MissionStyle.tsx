import styled from 'styled-components'
import theme from '../../styles/theme'

export const MissionWrap = styled.section`
    .create_mission {
        position: absolute;
        cursor: pointer;
        top: 76px;
        right: 16px;
        width: 42px;
        height: 42px;
        border-radius: 4px;
        box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.22);
        background-color: ${theme.color.white};
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${theme.color.black};
        font-weight: bold;
    }

    .isActive {
        background-color: ${theme.color.primary};
    }

    .init_mission {
        position: absolute;
        cursor: pointer;
        top: 128px;
        right: 16px;
        width: 42px;
        height: 42px;
        border-radius: 4px;
        box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.22);
        background-color: ${theme.color.white};
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${theme.color.black};
        font-weight: bold;
    }
`
