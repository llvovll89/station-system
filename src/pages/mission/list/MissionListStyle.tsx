import { styled } from 'styled-components'
import theme from '../../../styles/theme'

export const MissionListWrap = styled.section`
    width: 400px;
    height: 100vh;
    position: absolute;
    left: 90px;
    top: 0;
    background-color: rgba(0, 0, 0, 0.88);

    & header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${theme.color.white};
        padding: 0 12px;
        margin-bottom: 3px;

        .header_btn {
            display: flex;
            align-items: center;

            & button {
                width: 36px;
            }
        }
    }

    & .container {
        padding: 0.8rem 1rem;

        & .content {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            & .mission {
                padding: 0.5rem 0.7rem;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
                color: ${theme.color.white};
                box-shadow: rgba(0, 0, 0, 0.22);
                background-color: rgb(31 30 37);
                border: 1px solid rgba(255, 255, 255, 0.22);

                &.active {
                    border: 1px solid ${theme.color.primary};
                    color: ${theme.color.white};

                    & .content,
                    & header,
                    & .date {
                        color: ${theme.color.white};
                    }

                    & header {
                        padding: 0;
                        & .mission_name {
                            color: ${theme.color.white};
                        }
                    }
                }

                & header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0;

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
                    margin-top: 0.35rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    font-size: 14px;

                    & .mission_type {
                        display: flex;
                        align-items: center;
                        gap: 0.35rem;

                        & span {
                            font-size: 14px;
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
                                font-size: 14px;

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
            padding: 0;

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
                font-size: 14px;
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
                    font-size: 14px;
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
        background-color: ${theme.color.black};
        min-width: 360px;
        color: ${theme.color.white};
        left: 400px;
        bottom: 16px;
        border-radius: 5px;
        box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.33);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        header {
            padding-bottom: 0.5rem;
        }

        & .content {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;

            & .area {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
`
