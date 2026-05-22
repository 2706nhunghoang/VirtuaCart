import { useState } from 'react'
import Layout from './components/Layout/Layout'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Cart from './pages/Cart'
import { PAGES } from './constants/paths'

function AppContent({ currentPage, onNavigate }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Login />
  if (currentPage === PAGES.CART) return <Cart onNavigate={onNavigate} />
  return <Home onNavigate={onNavigate} />
}


function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME)
  const navigate = (page) => setCurrentPage(page)

  return (
    <Layout onNavigate={navigate}>
      <AppContent currentPage={currentPage} onNavigate={navigate} />
    </Layout>
  )
}

export default App