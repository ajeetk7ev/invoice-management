import { BrowserRouter } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  // Synchronize theme on initial mount
  useTheme()

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
