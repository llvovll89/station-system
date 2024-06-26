import { styled } from 'styled-components'
import theme from '../../../styles/theme'

export const MissionListWrap = styled.section`
    width: 350px;
    height: 100vh;
    position: absolute;
    left: 90px;
    top: 0;
    background-color: ${theme.color.subBlack};

    & header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${theme.color.white};
        border-bottom: 1px solid rgba(255, 255, 255, 0.33);

        h1 {
            padding-left: 12px;
        }

        button {
            width: 52px;
        }
    }

    & .container {
        padding: 0.5rem;

        & .content {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            & .mission {
                background-color: ${theme.color.white};
                padding: 0.5rem 0.7rem;
                border-radius: 4px;
                cursor: pointer;
                border: 3px solid ${theme.color.green};
                transition: all 0.15s ease-in-out;

                &.active {
                    border: 3px solid ${theme.color.primary};
                }

                & header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    & .mission_name {
                        color: ${theme.color.black};
                    }

                    & .content_actios {
                        display: flex;
                        align-items: center;

                        & button {
                            width: 36px;
                            height: 24px;

                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }

                    button {
                        width: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    }
                }

                & .content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    font-size: 12px;
                    color: ${theme.color.black};

                    & .mission_type {
                        display: flex;
                        align-items: center;
                        gap: 0.35rem;

                        & span {
                            font-size: 12px;
                            &:first-child {
                                color: rgba(140, 140, 140, 1);
                            }
                        }
                    }

                    & .date {
                        display: flex;
                        flex-direction: column;

                        & div {
                            display: flex;
                            align-items: center;
                            gap: 0.25rem;

                            span {
                                font-size: 12px;

                                &:first-child {
                                    color: rgba(140, 140, 140, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .update_mission {
        position: absolute;
        background-color: ${theme.color.white};
        min-width: 360px;
        color: ${theme.color.black};
        left: 400px;
        top: 16px;
        border-radius: 5px;
        box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.33);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        font-size: 14px;

        header {
            color: ${theme.color.black};

            & .header_title {
                display: flex;
                gap: 0.25rem;
                align-items: center;

                & span {
                    &:first-child {
                        font-size: 16px;
                    }
                }
            }

            & .close_btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: max-content;
                height: max-content;

                & span {
                    width: 24px;
                    height: 24px;
                    border-radius: 100%;
                    background-color: ${theme.color.black};
                    display: inline-block;
                    color: ${theme.color.white};
                }
            }
        }

        & .content {
            display: flex;
            gap: 0.8rem;
            flex-direction: column;

            .top {
                display: flex;
                gap: 0.5rem;
                align-items: center;

                label {
                    width: 30%;
                }

                input {
                    width: 70%;
                    height: 36px;
                    border: 1px solid ${theme.color.subBlack};
                    border-radius: 5px;
                    padding: 0 0.75rem;
                }
            }

            & .mission_type {
                font-size: 12px;
            }

            & .ways {
                display: flex;
                justify-content: space-between;
                align-items: center;

                & div {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;

                    & span {
                        font-size: 14px;
                    }
                }
            }

            & .date {
                display: flex;
                flex-direction: column;

                span {
                    font-size: 12px;
                }
            }

            .update_btn {
                color: ${theme.color.white};
                background-color: ${theme.color.primary};
                border-radius: 5px;
                box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.33);
            }
        }
    }

    .mission_info {
        position: absolute;
        background-color: ${theme.color.white};
        min-width: 360px;
        color: ${theme.color.black};
        left: 400px;
        bottom: 16px;
        border-radius: 5px;
        box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.33);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        header {
            color: ${theme.color.black};
        }

        & .content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`
