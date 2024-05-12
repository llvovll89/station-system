import styled from "styled-components"

const DialogContainer = styled.section`
    max-width: 500px;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`

export const Dialog = () => {
    return (
        <DialogContainer>
            <h1>hi</h1>
        </DialogContainer>
    )
}