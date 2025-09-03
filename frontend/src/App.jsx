import React, { useState } from 'react'
import Signup from './componets/singup'
import Login from './componets/login'
import Dashboard from './componets/dashboard'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('login') // 'signup', 'login', or 'dashboard'
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleSignOut = () => {
    setUser(null)
    setCurrentView('login')
  }

  return (
    <div className="app">
      {currentView === 'login' ? (
        <Login
          onSwitchToSignup={() => setCurrentView('signup')}
          onLogin={handleLogin}
        />
      ) : currentView === 'signup' ? (
        <Signup
          onSwitchToLogin={() => setCurrentView('login')}
          onSignup={handleLogin}
        />
      ) : (
        <Dashboard
          user={user}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  )
}
