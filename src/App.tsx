import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import { GlobalStyles } from './styles/reset'
import { Home } from './pages/Home'
import axios from 'axios'

axios.defaults.withCredentials = true

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Home />
        </ThemeProvider>
    )
}

export default App
