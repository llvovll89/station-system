import styled from 'styled-components'
import theme from '../styles/theme'
import * as routes from '../constant/Routes'
import { Link, useNavigate } from 'react-router-dom'
import accountIcon from '../assets/image/icon/user(w).png'
import { useEffect, useState } from 'react'
import { timeOut } from '../util/timeOut'
import { IoHomeOutline } from 'react-icons/io5'
import { Button } from './button/Button'

const HeaderStyled = styled.header`
    width: 90px;
    height: 100vh;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
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
        gap: 1rem;
        justify-content: center;

        & li {
            width: 100%;
            text-align: center;

            &.active {
                background-color: ${theme.color.primary};
                color: ${theme.color.white}; // 텍스트 색상 변경
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
    toggleSchedule: () => void
}

export const Header = ({
    toggleMission,
    toggleStation,
    toggleSchedule,
}: HeaderProps) => {
    const [isActive, setIsActive] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem('user'))
    const navigate = useNavigate()

    const logOut = () => {
        const ask = confirm('정말 로그아웃 하시겠나요~?')

        if (ask) {
            localStorage.removeItem('user')
            setIsLoggedIn(true)
        }
    }

    const toggleActive = (type: string) => {
        setIsActive((prev) => (prev === type ? '' : type))
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
                <li
                    className={isActive === 'mission' ? 'active' : ''}
                    onClick={() => toggleActive('mission')}
                >
                    <Button onClick={toggleMission} type="button">
                        <span>Mission</span>
                    </Button>
                </li>
                <li
                    className={isActive === 'station' ? 'active' : ''}
                    onClick={() => toggleActive('station')}
                >
                    <Button onClick={toggleStation} type="button">
                        <span>Station</span>
                    </Button>
                </li>
                <li
                    className={isActive === 'schedule' ? 'active' : ''}
                    onClick={() => toggleActive('schedule')}
                >
                    <Button onClick={toggleSchedule} type="button">
                        <span>Schedule</span>
                    </Button>
                </li>
            </ul>

            <button className="account" onClick={logOut}>
                <img src={accountIcon} alt="user(w).png" />
            </button>
        </HeaderStyled>
    )
}
