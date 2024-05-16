import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import { GlobalStyles } from './styles/reset'
import { Home } from './pages/Home'

function App() {

  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Home />
    </ThemeProvider>
  )
}

export default App
