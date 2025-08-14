import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { PrivacyProvider } from './context/PrivacyContext'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PrivacyProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </PrivacyProvider>
    </ThemeProvider>
  </StrictMode>,
)
