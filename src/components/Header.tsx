import styled from "styled-components";
import { NavBar } from "./Navbar";

const HeaderStyled = styled.header`
    width: 100%;
    height: 50px;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const Header = () => {
    return (
        <HeaderStyled>
            <div>
                <span>STATION SYSTEM</span>
            </div>

            <NavBar />

            <div>
                <span>account</span>
            </div>
        </HeaderStyled>
    )
};