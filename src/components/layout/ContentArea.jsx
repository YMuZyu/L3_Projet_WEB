import NavMenu from '../nav/NavMenu.jsx'
import '../../styles/layout/ContentArea.css'

export default function ContentArea({ user, isConnected, onLogin, onLogout }) {
  return (
    <main className="content-area">
      <NavMenu
        user={user}
        isConnected={isConnected}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </main>
  )
}