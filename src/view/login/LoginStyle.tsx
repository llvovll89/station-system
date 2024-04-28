import styled from "styled-components";
import theme from "../../styles/theme";

export const LoginWrap = styled.section`
    width: 100vw;
    min-height: 100vh;
    position: relative;
    color: ${theme.color.black};
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.color.subPrimary};

    & .content {
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        padding: 2rem 1.5rem;
        border-radius: 4px;
        background-color: ${theme.color.white};
        box-shadow: ${theme.boxShadow?.sm};

        .logo_box {
            & h1 {
                font-size: 2.5rem;
                font-weight: 700;
                letter-spacing: -0.055rem;
                color: ${theme.color.primary};
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
                font-size: ${theme.fonsize.sm};
            
                & div {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                
                    & input {
                        background-color: rgba(255,255,255,0.13);
                        transition: all 0.15s ease-in-out;
                        padding-left: 38px;
                        height: 50px;

                        &:focus {
                            border: 1px solid #09f;
                            background-color: rgba(247,237,251,244.09);
                        }
                    }
                
                    & svg {
                        position: absolute;
                        top: 49px;
                        left: 12px;
                        width: 20px;
                        height: 20px;
                    }
                }
            
                & .password-box {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
            }
        
            & .center {
                width: 100%;
                display: flex;
                gap: 6px;
            
                & label {
                    font-size: ${theme.fonsize.xs};
                    cursor: pointer;
                }
    
            & input[type='checkbox'] {
                cursor: pointer;
            }
        }
    
        & .fail {
            color: ${theme.color.red};
            font-size: ${theme.fonsize.sm};
        }
    
        
        & .btn-box {
            display: flex;
            flex-direction: column;
            gap: 6px;
    
            & button {
                background-color: ${theme.color.primary};
                color: ${theme.color.white};
                height: 50px;
            }
        }
        }
    
        & .bt_list {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
    
                & li {
                    padding-right: 16px;
                    border-right: 1px solid rgba(0,0,0,0.3  );
    
                    &:last-child {
                        border: none;
                    }

                    & a {
                        font-size: 14px;
                        transition: all 0.15s ease-out;

                        &:hover {
                            color: ${theme.color.primary};
                        }
                    }
                }
        }
    }
`