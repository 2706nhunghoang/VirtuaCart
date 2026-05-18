import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './store/cartContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout/Layout'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Cart from './pages/Cart'

function AppContent({ currentPage, onNavigate }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Login />
  if (currentPage === 'cart') return <Cart onNavigate={onNavigate} />
  return <Home onNavigate={onNavigate} />
}


function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const navigate = (page) => setCurrentPage(page)

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Layout onNavigate={navigate}>
            <AppContent currentPage={currentPage} onNavigate={navigate} />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App