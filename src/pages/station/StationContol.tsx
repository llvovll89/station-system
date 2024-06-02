import styled from 'styled-components'
import theme from '../../styles/theme'
import { Station } from '../../dto/Station'
import { Button } from '../../components/button/Button'
import { IoClose } from 'react-icons/io5'

interface StationControlProps {
    toggleIsOpen: () => void
    selectedStation: Station | null
}

const StationControlWrap = styled.section`
    position: absolute;
    top: 20px;
    right: 80px;
    min-width: 360px;
    background-color: ${theme.color.black};
    color: ${theme.color.white};

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
