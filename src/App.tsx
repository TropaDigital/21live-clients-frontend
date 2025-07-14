import Router, { ScrollToTop } from './core/routes'
import { ThemeProvider } from 'styled-components'
import { theme } from './assets/theme/theme'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './core/contexts/AuthContext'
import { TenantProvider } from './core/contexts/TenantContext'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { AlertProvider } from './core/contexts/AlertContext'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <TenantProvider>
          <AlertProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Router />
              <ReactTooltip id="tooltip" />
            </BrowserRouter>
          </AlertProvider>
        </TenantProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
