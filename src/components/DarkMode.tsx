import { useState } from 'react'

export const DarkMode: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true)

  const handleFilter = (): void => {
    setDarkMode((prevInvert) => !prevInvert)

    // Get the <html> element and directly modify its style
    const htmlElement = document.querySelector('html')
    if (htmlElement != null) {
      htmlElement.style.filter = darkMode ? '' : 'invert(1)'
    }
  }

  return (
    <button
      onClick={handleFilter}
      className='darkbtn'>
      Dark Mode
    </button>
  )
}
