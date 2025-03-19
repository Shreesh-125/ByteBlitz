import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')
    const reduxState = useSelector(state => state)

    const themeVariables = {
        light: {
            headingTextColor: "#ffffff",
            headingBGColor: "#3E5879",
            secondaryBGColor: "#F5EFE7",
            textColor: "#000000",
            contestBGColor: "#FCF6ED",
            filterBGColor: "#ffffff",
            tableBGColor1: "#FFFFFF",
            tableBGColor2: "#F0F9FF",
        },
        dark: {
            headingTextColor: "#FFFFFF",
            headingBGColor: "#3E5879",
            secondaryBGColor: "#2A2620",
            filterBGColor: "#121212",
            textColor: "#ffffff",
            contestBGColor: "#25211A",
            tableBGColor1: "#121212",
            tableBGColor2: "#1B2226",
        }
    }

    const rootStyle = {
        '--heading-text-color': themeVariables[theme].headingTextColor,
        '--heading-bg-color': themeVariables[theme].headingBGColor,
        '--secondary-bg-color': themeVariables[theme].secondaryBGColor,
        '--filter-bg-color': themeVariables[theme].filterBGColor,
        '--text-color': themeVariables[theme].textColor,
        '--contest-bg-color': themeVariables[theme].contestBGColor,
        '--table-bg-color-1': themeVariables[theme].tableBGColor1,
        '--table-bg-color-2': themeVariables[theme].tableBGColor2,
    };

    useEffect(() => {
        if (reduxState) {
            setTheme(reduxState?.theme?.theme);
        }
    }, [reduxState])
    return (
        <div style={rootStyle}>
            {children}
        </div>
    )
}

export default ThemeProvider