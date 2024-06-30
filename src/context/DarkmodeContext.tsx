import { ReactNode, createContext, useState } from 'react'
import { DarkModeContextType } from '../constant/type'

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
    undefined
)

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode)
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}
