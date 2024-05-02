import styled from "styled-components";
import theme from "../styles/theme";
import { Ref } from "react";

interface InputType {
    name?: string;
    value?: string;
    id: string;
    type: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    ref?: Ref<HTMLInputElement>;
}

const LoginInput = styled.input.attrs<InputType>((props) => ({
    ref: props.ref
}))<InputType>`
    width: 100%;
    height: 42px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0 12px;
    background: ${theme.color.white};
    color: ${theme.color.black};
`

export const Input = (input: InputType) => {
    return (
        <LoginInput type={input.type} name={input.name} value={input.value} id={input.id} onChange={input.onChange} ref={input.ref} autoComplete="off"/>
    )
}
