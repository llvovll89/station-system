import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import { GlobalStyles } from './styles/reset'
import { Home } from './pages/Home'
import axios from 'axios'
import { DarkModeProvider } from './context/DarkmodeContext'

axios.defaults.withCredentials = true

function App() {
    return (
        <ThemeProvider theme={theme}>
            <DarkModeProvider>
                <GlobalStyles />
                <Home />
            </DarkModeProvider>
        </ThemeProvider>
    )
}

export default App
