import { useState } from "react"
import { useNavigate } from "react-router-dom"
import '../styles/pages/LoginPage.css'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    try {
      const res = await fetch("http://localhost:10000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login: username, password: password })
      })

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur de connexion");
        return;
      }

      setError("")
      onLogin(data)
      navigate("/")

    } catch (err) {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="login-page">
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Se connecter</button>
      </form>
      <p>Pas encore de compte ? <span onClick={() => navigate("/register")}>S'inscrire</span></p>
    </div>
  )
}