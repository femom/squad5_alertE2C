import { createContext, useContext, useEffect, useRef, useState } from 'react'

const ThemeContext = createContext(null)

function applyThemeClass(mode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  document.documentElement.style.colorScheme = mode
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0E1226' : '#F7F6F0')
}

export function ThemeProvider({ children }) {
  const [flashActive, setFlashActive] = useState(false)
  const toggleTimers = useRef([])
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    const initialTheme = saved === 'dark' || saved === 'light' ? saved : 'light'
    applyThemeClass(initialTheme)
    return initialTheme
  })

  useEffect(() => {
    applyThemeClass(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => () => toggleTimers.current.forEach(clearTimeout), [])

  const toggleTheme = (event) => {
    if (flashActive) return
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const bounds = event?.currentTarget?.getBoundingClientRect()
    const x = bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2
    const y = bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2
    document.documentElement.style.setProperty('--theme-flash-x', `${x}px`)
    document.documentElement.style.setProperty('--theme-flash-y', `${y}px`)
    document.documentElement.style.setProperty('--theme-reveal-color', nextTheme === 'dark' ? '#0E1226' : '#F7F6F0')
    setFlashActive(true)

    toggleTimers.current = [
      setTimeout(() => {
        applyThemeClass(nextTheme)
        localStorage.setItem('theme', nextTheme)
        setTheme(nextTheme)
      }, 0),
      setTimeout(() => {
        setFlashActive(false)
        document.documentElement.style.removeProperty('--theme-flash-x')
        document.documentElement.style.removeProperty('--theme-flash-y')
        document.documentElement.style.removeProperty('--theme-reveal-color')
      }, 620)
    ]
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, flashActive }}>
      {children}
      {flashActive && <div aria-hidden="true" className="theme-flash-overlay" />}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme doit être utilisé dans ThemeProvider')
  return context
}
