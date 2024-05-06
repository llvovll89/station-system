import styled from "styled-components";

export const MissionWrap = styled.section`
    width: 100vw;
    height: 100vh;

    & header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        background: #FEFEFE;
        font-weight: bold;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.5rem;

        & div{
            display: flex;
            gap: 0.5rem;
            align-items: center;
            
            & button {
            width: 100px;
            background: #111111;
            }
        }
        
    }
    
`