import { useState } from "react"
import { useNavigate } from "react-router-dom"
import '../styles/pages/RegisterPage.css'


const isPasswordStrong = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/
    return regex.test(password)
}

export default function RegisterPage({ onLogin }) {

    const navigate = useNavigate()

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [message, setMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const handleRegister = async () => {

        if (!login || !password || !password2) {
            setMessage("Veuillez remplir tous les champs")
            return
        }

        if (password !== password2) {
            setMessage("Les mots de passe ne correspondent pas")
            return
        }

        if (!isPasswordStrong(password)) {
            setMessage("Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule et un chiffre")
            return
        }

        try {
            const response = await fetch("http://localhost:10000/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password, password2 })
            })

            const data = await response.json()
            setMessage(data.message)

            if (response.status === 201) {
                onLogin(data)
                setTimeout(() => navigate("/"), 1000)
            }

        } catch (error) {
            setMessage("Erreur de connexion au serveur")
            console.error(error)
        }
    }

    return (
        <div className="register-page">
            <h2>Inscription</h2>

            <div className="register-form">
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />

                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <div className="password-field">
                    <input
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <button onClick={() => setShowPassword2(!showPassword2)}>
                        {showPassword2 ? "🙈" : "👁️"}
                    </button>
                </div>

                {message && <p className="message">{message}</p>}

                <button className="register-btn" onClick={handleRegister}>
                    S'inscrire
                </button>

                <p>Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span></p>
            </div>
        </div>
    )
}