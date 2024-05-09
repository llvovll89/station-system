import { Link } from "react-router-dom"
import * as routes from "../constant/Routes"
import styled from "styled-components"
import theme from "../styles/theme"

interface NavBarProps {

}

const NavbarStyled = styled.nav`
    height: 100%;

    & ul {
        display: flex;
        align-items: center;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        gap: 1.5rem;
        justify-content: center;

        & li {
            & a {
                color: ${theme.color.white};
            }
        }
    }
`

export const NavBar = () => {
    return (
        <NavbarStyled>
            <ul>
                <li>
                    <Link to={routes.MISSION}>
                        M
                    </Link>
                </li>
                <li>
                    <Link to={routes.STATION}>
                        S
                    </Link>
                </li>
                <li>...</li>
                <li>...</li>
            </ul>
        </NavbarStyled>
    )
}