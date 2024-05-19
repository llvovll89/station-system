import styled from "styled-components";
import theme from "../styles/theme";
import * as routes from "../constant/Routes";
import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "./Navbar";
import accountIcon from "../assets/image/icon/user(w).png"
import { useEffect, useState } from "react";
import { timeOut } from "../util/timeOut";

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
    background-color: ${theme.color.black};
    color: ${theme.color.white};

    & div {
        & a {
            color: ${theme.color.white};
        }
    }

    & .account {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
    }
`

export const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem("user"));
    const navigate = useNavigate();

    const logOut = () => {
        const ask = confirm('정말 로그아웃 하시겠나요~?');

        if (ask) {
            localStorage.removeItem("user");
            setIsLoggedIn(true);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            !localStorage.getItem("user") && timeOut(1500, () => { navigate("/") });
        }
    }, [isLoggedIn]);

    return (
        <HeaderStyled>
            <div>
                <Link to={routes.MAIN}>HOME</Link>
            </div>

            <NavBar />

            <button className="account" onClick={logOut}>
                <img src={accountIcon} alt="user(w).png" />
            </button>
        </HeaderStyled>
    )
};