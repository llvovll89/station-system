import { styled } from 'styled-components'
import theme from '../../../styles/theme'

export const StationWrap = styled.section`
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

        & .btn_content {
            display: flex;
            align-items: center;
            padding-right: 12px;

            button {
                width: 36px;
            }
        }
    }

    & .container {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        padding: 0.8rem 1rem;

        .content {
            background-color: ${theme.color.white};
            padding: 0.5rem 0.7rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            border-radius: 4px;
            border: 2px solid ${theme.color.white};
            transition: all 0.3s ease-in-out;
            cursor: pointer;

            &.selected {
                background-color: #2eb573;
                color: ${theme.color.white};
                // border: 2px solid ${theme.color.primary};
            }

            & .content_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.5rem;
                padding: 0;

                & .content_header_items {
                    display: flex;

                    button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        cursor: pointer;
                    }
                }
            }

            & .content_body {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;

                & div {
                    display: flex;
                    gap: 0.25rem;
                    align-items: center;

                    & span {
                        &.idle {
                            color: ${theme.color.green};
                        }

                        &.active {
                            color: ${theme.color.primary};
                        }
                    }
                }

                & .coords {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            }

            & .content_drone {
                & .drone {
                    & .name {
                        color: ${theme.color.green};
                    }
                }
            }
        }
    }
`
