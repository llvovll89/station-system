import styled from "styled-components";
import { NavBar } from "./Navbar";
import theme from "../styles/theme";

const HeaderStyled = styled.header`
    width: 50px;
    height: 100vh;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 10;
    background-color: ${theme.color.black};
    color: ${theme.color.white};

    & div {
        padding: 12px 0;
    }
`

export const Header = () => {
    return (
        <HeaderStyled>
            <div>
                <span>LOGO</span>
            </div>

            <NavBar />

            <div>
                <span>account</span>
            </div>
        </HeaderStyled>
    )
};