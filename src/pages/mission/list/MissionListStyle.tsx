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
                    }

                    button {
                        width: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    }
                }
            }
        }
    }
`
