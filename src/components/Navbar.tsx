import styled from "styled-components"
import theme from "../styles/theme"
import missionIcon from "../assets/image/navbar/ico_mission.png"
import stationIcon from "../assets/image/navbar/ico_station.png"

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
                    {/* <Link to={routes.MISSION}> */}
                    <img src={missionIcon} alt="mission" />
                    {/* </Link> */}
                </li>
                <li>
                    {/* <Link to={routes.STATION}> */}
                    <img src={stationIcon} alt="station" />
                    {/* </Link> */}
                </li>
            </ul>
        </NavbarStyled>
    )
}