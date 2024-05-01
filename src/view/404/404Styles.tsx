import styled from "styled-components";
import theme from "../../styles/theme";

export const NotFoundPageComponent = styled.section`
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F5F7F8;

    & article {
        padding: 2rem 3rem;
        width: max-content;
        height: 260px;
        border-radius: 6px;
        // box-shadow: 0 0 5px 0 rgba(0,0,0,0.22);
        // color: ${theme.color.white};
        gap: 2rem;
        display: flex;
        align-items: center;

        
            & .sub_body {
                padding-top: 2rem;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;

                & h1 {
                    font-family: 'GangwonEduPowerExtraBoldA', 'Pretendard', sans-serif;
                    font-size: 2rem;
                    font-weight: 700;
                    letter-spacing: -0.055rem;
                    color: ${theme.color.red};
                }

                & .text {
                    display: flex;
                    flex-direction: column;

                    & span {
                        font-family: 'GangwonEduPowerExtraBoldA', 'Pretendard', sans-serif;
                    }
                }
            
        }
        
    }
`