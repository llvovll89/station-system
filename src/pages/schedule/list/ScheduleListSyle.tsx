import styled from "styled-components";
import theme from "../../../styles/theme";

export const ScheduleListWrap = styled.section`
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
        padding: 0.8rem 1rem;
        font-size: 14px;

        & .schedule_list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: calc(100vh - 60px);
            overflow-y: auto;
            overflow-x: hidden;

            & .schedule {
                display: flex;
                flex-direction: column;
                gap: 0.35rem;
                border-radius: 5px;
                padding: 0.5rem 0.75rem;
                color: ${theme.color.white};
                box-shadow: rgba(0, 0, 0, 0.22);
                background-color: rgb(31 30 37);
                border: 1px solid rgba(255, 255, 255, 0.22);
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease-in-out;

                &:hover {
                    border: 1px solid ${theme.color.primary};
                    transfrom: scale(1.05);
                }

                & span {
                    font-size: 14px;
                    &.title {
                        font-size: 16px;
                    }
                }

                &.active {
                    border: 1px solid ${theme.color.primary};

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
                        align-items: center;

                        & button {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 30px;

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
`;
