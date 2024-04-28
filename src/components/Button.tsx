import styled from "styled-components";
import theme from "../styles/theme";
import { Link } from "react-router-dom";

interface ButtonStyle {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    to?: string; 
    className?: string;
}

const ButtonComponent = styled.button`
    width: 100%;
    height: 50px;
    color: ${theme.color.white};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    & a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    & .back {
        width: 100px;
    }
`

export const Button = (btn: ButtonStyle) => {
    return btn.to ? (
        <ButtonComponent type="button">
            <Link to={btn.to}>
                {btn.text}
            </Link>
        </ButtonComponent>
        
    ) : (
        <ButtonComponent onClick={btn.onClick} type="button" className={btn.className}>
            <span>{btn.text}</span>
        </ButtonComponent>
    );
}