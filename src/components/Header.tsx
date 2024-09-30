import styled from 'styled-components'
import theme from '../styles/theme'
import { useNavigate } from 'react-router-dom'
import accountIcon from '../assets/image/icon/user(w).png'
import { useEffect, useState } from 'react'
import { timeOut } from '../util/timeOut'
import { IoHomeOutline } from 'react-icons/io5'
import { Button } from './button/Button'
import { useDarkMode } from '../hooks/useDarkmode'

const HeaderWrap = styled.header<{ isDarkMode: boolean }>`
    width: 76px;
    height: 100vh;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: ${({ isDarkMode }) =>
        isDarkMode ? theme.color.white : 'rgba(0, 0, 0, 0.88)'};
    color: ${({ isDarkMode }) =>
        isDarkMode ? 'rgba(0,0,0, 0.88)' : theme.color.white};
    border-right: 1px solid rgba(255, 255, 255, 0.3);

    & .logo {
        cursor: pointer;
    }

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
            width: 100%;
            text-align: center;
            font-size: 14px;

            &.active {
                background-color: ${theme.color.primary};
                color: ${theme.color.white}; // 텍스트 색상 변경
            }

            & button {
                & span {
                    font-size: 13px;
                }
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
        width: 26px;
        height: 26px;
        border-radius: 50%;
        cursor: pointer;
    }
`

interface HeaderProps {
    toggleMission: () => void
    toggleStation: () => void
    toggleSchedule: () => void
    isActive: string
    setIsActive: React.Dispatch<React.SetStateAction<string>>
}

export const Header = ({
    toggleMission,
    toggleStation,
    toggleSchedule,
    isActive,
    setIsActive,
}: HeaderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem('user'))
    const { isDarkMode } = useDarkMode()
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
        <HeaderWrap isDarkMode={isDarkMode}>
            <div className="logo" onClick={() => location.reload()}>
                <IoHomeOutline style={{ width: '24px', height: '24px' }} />
            </div>

            <ul>
                <li
                    className={isActive === 'mission' ? 'active' : ''}
                    onClick={() => toggleActive('mission')}
                >
                    <Button onClick={toggleMission} type="button">
                        <span>미션</span>
                    </Button>
                </li>
                <li
                    className={isActive === 'station' ? 'active' : ''}
                    onClick={() => toggleActive('station')}
                >
                    <Button onClick={toggleStation} type="button">
                        <span>스테이션</span>
                    </Button>
                </li>
                <li
                    className={isActive === 'schedule' ? 'active' : ''}
                    onClick={() => toggleActive('schedule')}
                >
                    <Button onClick={toggleSchedule} type="button">
                        <span>스케줄</span>
                    </Button>
                </li>
            </ul>

            <button className="account" onClick={logOut}>
                <img src={accountIcon} alt="user(w).png" style={{ width: '24px', height: '24px' }} />
            </button>
        </HeaderWrap>
    )
}
