import styled from 'styled-components'
import theme from '../../styles/theme'
import { Station } from '../../dto/Station'
import { Button } from '../../components/button/Button'
import { IoClose } from 'react-icons/io5'
import { useEffect } from 'react'

interface StationControlProps {
    toggleIsOpen: () => void
    selectedStation: Station | null
}

const StationControlWrap = styled.section`
    position: absolute;
    top: 36px;
    right: 80px;
    min-width: 420px;
    background-color: rgba(0, 0, 0, 0.8);
    color: ${theme.color.white};
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.22);

    & article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.8rem 1rem;

        & header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            & button {
                width: 24px;
                height: 24px;
            }
        }

        & .content {
            display: flex;
            gap: 0.5rem;
        }
    }
`

export const StationControl = ({
    toggleIsOpen,
    selectedStation,
}: StationControlProps) => {
    useEffect(() => {
        console.log(selectedStation)
    }, [selectedStation])

    return (
        <StationControlWrap>
            <article className="container">
                <header>
                    <h1>{selectedStation?.name}</h1>
                    <Button type={'button'} onClick={toggleIsOpen}>
                        <IoClose />
                    </Button>
                </header>
                <div className="content">
                    <p>상태:</p>
                    <p>{selectedStation?.status}</p>
                </div>
            </article>
        </StationControlWrap>
    )
}
