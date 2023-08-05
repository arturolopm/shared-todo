import { useEffect, useState } from 'react'

export const DarkMode: React.FC = () => {
  const getThemeInStorage = (): string | null => {
    return localStorage.getItem('theme')
  }
  const theme = !(
    getThemeInStorage() === 'false' || getThemeInStorage() === null
  )

  const [darkMode, setDarkMode] = useState(theme || false)

  const handleDarkMode = (): void => {
    const themeToSave = !darkMode
    const theme = themeToSave.toString()

    localStorage.setItem('theme', theme)
    setDarkMode((prev) => !prev)
  }

  const handleFilter = (): void => {
    // Get the <html> element and directly modify its style
    const htmlElement = document.querySelector('html')
    if (htmlElement != null) {
      htmlElement.style.filter = darkMode ? 'invert(1)' : ''
    }
  }
  useEffect(() => {
    handleFilter()
  }, [darkMode])

  return (
    <button
      onClick={() => {
        handleDarkMode()
      }}
      className='darkbtn'>
      Dark Mode
    </button>
  )
}
