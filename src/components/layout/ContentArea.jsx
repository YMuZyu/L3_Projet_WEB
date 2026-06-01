import AppRouter from './AppRouter.jsx'
import '../../styles/layout/ContentArea.css'

export default function ContentArea({ user, isConnected, onLogin, onLogout }) {
  return (
    <main className="content-area">
      <AppRouter
        user={user}
        isConnected={isConnected}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </main>
  )
}