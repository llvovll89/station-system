import styled from "styled-components";
import theme from "../../styles/theme";

export const LoginWrap = styled.section`
    width: 100%;
    min-height: 100vh;
    position: relative;
    color: ${theme.color.black};
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;

    & .content {
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        padding: 2rem 1.5rem;
        border-radius: 4px;

        .logo_box {
            & h1 {
                font-size: clamp(1.5rem, 3vw, 2.5rem);
                font-weight: 700;
                letter-spacing: -0.055rem;
                color: ${theme.color.primary};
                font-family: "GangwonEduPowerExtraBoldA", "Pretendard",
                    sans-serif;
            }
        }

        & article {
            width: 546px;
            height: auto;
            border-radius: 2px;
            padding: 40px 32px 20px 32px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            color: ${theme.color.black};

            & form {
                display: flex;
                flex-direction: column;
                gap: 24px;
                font-size: ${theme.fontSize.sm};
                width: 100%;

                & div {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                    width: 100%;

                    & .id {
                        border: 1px solid rgba(0, 0, 0, 0.1);
                    }

                    & input {
                        background-color: rgba(255, 255, 255, 0.13);
                        transition: all 0.15s ease-in-out;
                        padding-left: 38px;
                        height: clamp(42px, 1vw, 50px);
                        border-radius: 5px;
                        width: 100%;

                        &:focus {
                            border: 1px solid #09f;
                            background-color: rgba(247, 237, 251, 244.09);
                        }
                    }

                    & svg {
                        position: absolute;
                        top: 49px;
                        left: 12px;
                        width: 16px;
                        height: 16px;
                    }
                }

                & .password-box {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                & .center {
                    width: 100%;
                    display: flex;
                    gap: 6px;
                    flex-direction: row;

                    & input[type="checkbox"] {
                        cursor: pointer;
                        height: 16px;
                        width: 16px;
                    }

                    & label {
                        font-size: ${theme.fontSize.xs};
                        cursor: pointer;
                    }
                }

                & .fail {
                    color: ${theme.color.red};
                    font-size: ${theme.fontSize.xs};
                    padding: 6px 12px;
                    background-color: ${theme.color.subWhite};
                    border-radius: 5px;
                    height: 32px;
                    line-height: 32px;
                }

                & .suc {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px;
                    color: ${theme.color.white};
                    font-size: ${theme.fontSize.xs};
                    padding: 6px 12px;
                    height: 32px;
                    background-color: ${theme.color.primary};
                }

                & .btn-box {
                    & button {
                        background-color: ${theme.color.primary};
                        color: ${theme.color.white};
                        height: 50px;
                        border-radius: 5px;
                    }
                }
            }
        }

        & .bt_list {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;

            & li {
                padding-right: 16px;
                border-right: 1px solid rgba(0, 0, 0, 0.3);

                &:last-child {
                    border: none;
                }
                & a {
                    font-size: clamp(0.65rem, 2.5vw, 0.8rem);
                    transition: all 0.15s ease-out;
                    &:hover {
                        color: ${theme.color.primary};
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        & .content {
            & article {
                width: 95vw;
            }
        }
    }
`;
