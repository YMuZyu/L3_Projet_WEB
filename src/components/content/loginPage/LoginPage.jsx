import { useState } from "react";
import { useNavigate } from "react-router-dom"

import './LoginPage.css'

export default function LoginPage() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    // Simulation login (plus tard API)
    console.log("Login:", username)

    // Reset erreur
    setError("")

    // Redirection
    navigate("/profil")
  }

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

    </div>
  )
}