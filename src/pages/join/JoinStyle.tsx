import styled from 'styled-components'
import theme from '../../styles/theme'

export const JoinWrap = styled.section`
    width: 100vw;
    min-height: 100vh;
    position: relative;
    color: ${theme.color.black};
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;

    & .title {
        & h1 {
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: -0.055rem;
            color: ${theme.color.primary};
            font-family: 'GangwonEduPowerExtraBoldA', 'Pretendard', sans-serif;
        }
    }

    & .content {
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        padding: 3rem;
        border-radius: 4px;

        & header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            & div {
                display: flex;
                gap: 6px;
                align-items: center;
                width: max-content;
                cursor: pointer;

                & h1 {
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                & svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    cursor: pointer;
                }
            }

            & p {
                width: 100%;
                text-align: right;
                color: ${theme.color.red};
                font-size: ${theme.fontSize.sm};
                font-weight: bold;
            }
        }

        & section {
            width: 546px;
            height: auto;
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            color: ${theme.color.black};

            & form {
                display: flex;
                flex-direction: column;
                gap: 24px;
                font-size: ${theme.fontSize.sm};

                & div {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;

                    & input {
                        background-color: rgba(255, 255, 255, 0.13);
                        transition: all 0.15s ease-in-out;
                        padding-left: 38px;
                        height: 50px;
                        border-radius: 6px;

                        &:hover {
                            background-color: rgba(247, 237, 251, 244.09);
                        }

                        &:focus {
                            border: 1px solid #09f;
                            background-color: rgba(247, 237, 251, 244.09);
                        }
                    }

                    & svg {
                        position: absolute;
                        top: 50px;
                        left: 12px;
                        width: 20px;
                        height: 20px;
                    }
                }
            }

            & .bt_list {
                & button {
                    background-color: ${theme.color.primary};
                    height: 56px;
                    border-radius: 5px;
                }
            }
        }
    }
`
