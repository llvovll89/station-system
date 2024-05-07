import { Link } from "react-router-dom"
import * as routes from "../constant/Routes"
import styled from "styled-components"

interface NavBarProps {

}

const NavbarStyled = styled.nav`
    height: 100%;

    & ul {
        display: flex;
        align-items: center;
        justify-content: space-around;
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        gap: 1rem;

        & li {
            width: 100px;
        }
    }
`

export const NavBar = () => {
    return (
        <NavbarStyled>
            <ul>
                <li>
                    <Link to={routes.MISSION}>
                        MISSION
                    </Link>
                </li>
                <li>
                    <Link to={routes.STATION}>
                        STATION
                    </Link>
                </li>
                <li>...</li>
                <li>...</li>
            </ul>
        </NavbarStyled>
    )
}