import styled from 'styled-components'
import theme from '../styles/theme'
import * as routes from '../constant/Routes'
import { Link, useNavigate } from 'react-router-dom'
import accountIcon from '../assets/image/icon/user(w).png'
import { useEffect, useState } from 'react'
import { timeOut } from '../util/timeOut'
import { IoHomeOutline } from 'react-icons/io5'
import missionIcon from '../assets/image/navbar/ico_mission.png'
import stationIcon from '../assets/image/navbar/ico_station.png'
import { Button } from './button/Button'

const HeaderStyled = styled.header`
    width: 50px;
    height: 100vh;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 10;
    background-color: ${theme.color.subBlack};
    color: ${theme.color.white};
    border-right: 1px solid rgba(255, 255, 255, 0.3);

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

    & div {
        & a {
            color: ${theme.color.white};

            & svg {
                width: 24px;
                height: 24px;
            }
        }
    }

    & .account {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
    }
`

interface HeaderProps {
    toggleMission: () => void
    toggleStation: () => void
}

export const Header = ({ toggleMission, toggleStation }: HeaderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem('user'))
    const navigate = useNavigate()

    const logOut = () => {
        const ask = confirm('정말 로그아웃 하시겠나요~?')

        if (ask) {
            localStorage.removeItem('user')
            setIsLoggedIn(true)
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            !localStorage.getItem('user') &&
                timeOut(1500, () => {
                    navigate('/')
                })
        }
    }, [isLoggedIn])

    return (
        <HeaderStyled>
            <div className="logo">
                <Link to={routes.MAIN}>
                    <IoHomeOutline />
                </Link>
            </div>

            <ul>
                <li>
                    <Button onClick={toggleMission} type="button">
                        <img src={missionIcon} alt="Mission_list" />
                    </Button>
                </li>
                <li>
                    <Button onClick={toggleStation} type="button">
                        <img src={stationIcon} alt="station" />
                    </Button>
                </li>
            </ul>

            <button className="account" onClick={logOut}>
                <img src={accountIcon} alt="user(w).png" />
            </button>
        </HeaderStyled>
    )
}
