import styled from "styled-components";
import theme from "../../styles/theme";

export const MainWrap = styled.section`
    position: relative;
    width: 100vw;
    min-height: 100vh;

    & #map {
        width: 100vw;
        height: 100vh;
    }

    & .running_schedule {
        position: absolute;
        top: 16px;
        left: 50%;
        border-radius: 5px;
        padding: 0.7rem 1.25rem;
        background-color: ${theme.color.black};
        color: ${theme.color.white};
        transform: translateX(-50%);
        box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.33);

        & .running_content {
            & article {
                displaty: flex;
                flex-direction: column;
                gap: 12px;
                font-size: 14px;

                & div {
                    display: flex;
                    gap: 6px;
                    align-items: center;

                    & .chart_number {
                        border-radius: 100%;
                        width 20px;
                        height: 20px;
                        border: 1px solid #FFFFFF;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
        }
    }

    & .delete_marker {
        background-color: ${theme.color.subBlack};
        color: ${theme.color.white};
        padding: 0.3rem 0.75rem;
        font-size: 12px;
        border-radius: 5px;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .marker {
        width: 24px;
        height: 24px;
        border-radius: 5px;
        background-color: ${theme.color.deepKoamaru};
        border: 1px solid #fefefe;
        justify-content: center;
        align-items: center;
        display: flex;
        color: ${theme.color.white};
    }

    & .area_size {
        padding: 0.75rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 16px;
        border-radius: 5px;
        box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.26);
        background-color: ${theme.color.black};
        color: ${theme.color.white};
    }

    & .distance {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 12px;
        color: ${theme.color.subWhite};
        background-color: ${theme.color.black};
        padding: 0.5rem 1rem;
    }

    .create_mission_btn {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 1;
        width: 52px;
        height: 52px;
        background-color: ${(props) => props.theme.color.subBlack};
    }

    & .start_marker,
    & .end_marker {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: ${theme.color.white};
        border: 2px solid ${theme.color.primary};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.color.black};
    }

    & .edit_marker {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid ${theme.color.primary};
        background-color: ${theme.color.white};
    }

    & .waypoint_marker {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        border: 2px solid ${theme.color.primary};
        background-color: ${theme.color.white};
        color: ${theme.color.black};
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .wayline_marker {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.color.white};
        background-color: ${theme.color.white};
        border-radius: 50%;
        border: 3px solid ${theme.color.primary};
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
        color: ${theme.color.black};
        position: relative;

        & span {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            top: -28px;
            left: 0;
            font-size: 12px;
            font-weight: bold;
            width: 24px;
            height: 24px;
            background-color: ${theme.color.deepKoamaru};
            color: ${theme.color.white};
            border-radius: 100%;
            border: 1px solid ${theme.color.white};
            box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.26);
        }
    }

    & .points_marker {
        width: 26px;
        height: 26px;
        border-radius: 100%;
        border: 3px solid #231f20;
        background-color: #3772f0;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
    }

    & .dock_marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        border: 3px solid ${theme.color.primary};
        background-color: #231f20;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);

        & span {
            color: ${theme.color.white};
            font-size: 12px;
            font-weight: bold;
        }
    }

    & .drone_marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        border: 3px solid ${theme.color.green};
        background-color: #231f20;
        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.33);
        z-index: 100;

        & span {
            color: ${theme.color.white};
            font-size: 12px;
            font-weight: bold;
        }
    }

    .global_wrap {
        width: 100vw;
        height: 100vh;
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.33);
        z-index: 10;
    }

    & .bg_wrap {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.32);
        width: 100vw;
        height: 100vh;
    }

    & .updated_station {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 400px;
        border-radius: 5px;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.25);
        background-color: rgb(31, 30, 37);
        color: ${theme.color.white};
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;

        & header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            & button {
                width: max-content;
            }
        }

        & .input_area {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            & input {
                width: 100%;
                padding: 0.5rem;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                height: 40px;
            }
        }

        & .update_sation_btns {
            width: 100%;
            height: 42px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            
            & button {
                width: 100%;
                height: 100%;

                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(255,255,255,0.16);
                

                &:last-child {
                    background-color: ${theme.color.primary};
                    border: none;
                }
            }
        }
    }

    & .station_update_wrap {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.32);
        width: 100vw;
        height: 100vh;
    }
`;
