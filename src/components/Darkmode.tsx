import styled from 'styled-components'
import { MdOutlineDarkMode } from 'react-icons/md'
import { useDarkMode } from '../hooks/useDarkmode'
import theme from '../styles/theme'

const DarkmodeWrap = styled.button<{ isDarkMode: boolean }>`
    position: absolute;
    bottom: 16px;
    right: 12px;
    width: 42px;
    height: 42px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ isDarkMode }) =>
        isDarkMode ? theme.color.primary : theme.color.designBlack};
    cursor: pointer;
    color: ${theme.color.white};
`

export const DarkMode = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    return (
        <DarkmodeWrap isDarkMode={isDarkMode} onClick={toggleDarkMode}>
            <MdOutlineDarkMode style={{ width: '24px', height: '24px' }} />
        </DarkmodeWrap>
    )
}
