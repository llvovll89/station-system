import styled from "styled-components";
import theme from "../../styles/theme";
import { Link } from "react-router-dom";

interface ButtonProps {
    text?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    to?: string;
    type: "button" | "submit";
    className?: string;
    bgColor?: string;
    children?: React.ReactNode;
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

export const Button = (btn: ButtonProps) => {
    return btn.to ? (
        <ButtonComponent type="button">
            <Link to={btn.to}>
                {btn.text}
            </Link>
        </ButtonComponent>

    ) : (
        <ButtonComponent onClick={btn.onClick} type={btn.type} className={btn.className}>
            {btn.children || <span>{btn.text}</span>}
        </ButtonComponent>
    );
}