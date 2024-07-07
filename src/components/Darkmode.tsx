import styled from 'styled-components'
import { MdOutlineDarkMode } from 'react-icons/md'
import { useDarkMode } from '../hooks/useDarkmode'
import theme from '../styles/theme'

const DarkmodeWrap = styled.button<{ isDarkMode: boolean }>`
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 62px;
    height: 62px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ isDarkMode }) =>
        isDarkMode ? theme.color.primary : 'rgba(0, 0, 0, 0.88)'};
    cursor: pointer;
    color: ${theme.color.white};
`

export const DarkMode = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    return (
        <DarkmodeWrap isDarkMode={isDarkMode} onClick={toggleDarkMode}>
            <MdOutlineDarkMode style={{ width: '20px', height: '20px' }} />
        </DarkmodeWrap>
    )
}
