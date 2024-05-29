import { IoClose } from 'react-icons/io5'
import { Button } from '../../../components/button/Button'
import { styled } from 'styled-components'
import theme from '../../../styles/theme'

const MissionListWrap = styled.section`
    width: 300px;
    height: 100vh;
    position: absolute;
    left: 64px;
    top: 0;
    background-color: ${theme.color.black};

    & header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${theme.color.white};
        border-bottom: 1px solid rgba(255, 255, 255, 0.33);

        h1 {
            padding-left: 12px;
        }

        button {
            width: 52px;
        }
    }
`

interface StationListProps {
    toggleStation: () => void
}

export const StationList = ({ toggleStation }: StationListProps) => {
    return (
        <MissionListWrap>
            <header>
                <h1>스테이션</h1>

                <Button type={'button'} onClick={toggleStation}>
                    <IoClose />
                </Button>
            </header>
        </MissionListWrap>
    )
}
