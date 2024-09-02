import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import { GlobalStyles } from './styles/reset'
import { Home } from './pages/Home'
import axios from 'axios'
import { DarkModeProvider } from './context/DarkmodeContext'
import { NaverMapProvider } from './context/MapContext'

axios.defaults.withCredentials = true

function App() {
    return (
        <ThemeProvider theme={theme}>
            <DarkModeProvider>
                <NaverMapProvider>
                    <GlobalStyles />
                    <Home />
                </NaverMapProvider>
            </DarkModeProvider>
        </ThemeProvider>
    )
}

export default App
