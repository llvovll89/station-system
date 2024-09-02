import { ReactNode, createContext, useState } from 'react'
import { NaverMapContextType } from '../constant/type'

export const DarkModeContext = createContext<NaverMapContextType | undefined>(
    undefined
)

export const NaverMapProvider = ({ children }: { children: ReactNode }) => {
    const [map, setMap] = useState(null);

    return (
        <DarkModeContext.Provider value={{ map, setMap }}>
            {children}
        </DarkModeContext.Provider>
    )
}
