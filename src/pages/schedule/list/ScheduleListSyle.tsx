import styled from 'styled-components'
import theme from '../../../styles/theme'

export const ScheduleListWrap = styled.section`
    width: 350px;
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
        border-bottom: 1px solid rgba(255, 255, 255, 0.33);

        h1 {
            padding-left: 12px;
        }

        .content_btn {
            display: flex;
            align-items: center;
            padding-right: 12px;

            & button {
                width: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    & .container {
        padding: 0.8rem;
        font-size: 14px;

        & .schedule_list {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            & .schedule {
                display: flex;
                flex-direction: column;
                gap: 0.35rem;
                border-radius: 5px;
                background-color: ${theme.color.white};
                color: #231f20;
                padding: 0.5rem 0.75rem;
                box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.22);
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease-in-out;

                & span {
                    font-size: 14px;
                    &.title {
                        font-size: 16px;
                    }
                }

                &.active {
                    background-color: #2772f0;
                    color: ${theme.color.white};

                    & svg {
                        & svg {
                            color: ${theme.color.white};
                        }
                    }
                }

                & .content_header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    & .btn_box {
                        display: flex;
                        gap: 0.5rem;
                        align-items: center;

                        & button {
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            & svg {
                                color: #231f20;
                            }
                        }
                    }
                }

                & .scheudule_content {
                    display: flex;
                    gap: 0.5rem;
                    flex-direction: column;
                }

                & .schedule_date {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;

                    & span {
                        &:first-child {
                            color: #cecece;
                        }
                    }
                }
            }
        }
    }
`
