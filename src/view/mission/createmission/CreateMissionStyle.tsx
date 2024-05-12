import styled from "styled-components";
import theme from "../../../styles/theme";

export const CreateMissionWrap = styled.section`
    width: 100vw;
    height: 100vh;
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.22);
    z-index: 100;

    & .container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 400px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 2rem 1.8rem;
        border-radius: 4px;
        background-color: ${theme.color.black};
        color: ${theme.color.white};
        transform: translate(-50%, -50%);
        z-index: 110;

        & button {
            width: 100%;
            height: 46px;
            border: 1px solid #f3f3f3;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        & header {
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            & button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
            }
        }

        & article {
            & p {
                padding-bottom: 1rem;
            }

            & .grid {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
        }

        & footer {
            display: flex;
            align-items: center;
            gap: 0.25rem;

            & button {
                &:last-child{
                    background-color: ${theme.color.primary};
                }
            }
        }
    }
`