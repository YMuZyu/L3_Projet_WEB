import { useState } from "react"
import { useNavigate } from "react-router-dom"
import '../styles/pages/RegisterPage.css'

const isPasswordStrong = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/
    return regex.test(password)
}

export default function RegisterPage( ) {

    const navigate = useNavigate()

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

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
            const response = await fetch("/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password, password2 })
            })

            const data = await response.json()

            if (response.status === 201) {
                // Ne pas connecter l'utilisateur, il doit attendre validation admin
                setIsSuccess(true)
                setMessage("Inscription envoyée ! Un administrateur doit valider votre compte avant que vous puissiez vous connecter."),
                setTimeout(() => navigate("/login"), 3000)
            }else {
                setMessage(data.message)
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

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
                
                <label className="show-password-label">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Afficher
                </label>

                {message && (
                    <p className={isSuccess ? "message success" : "message"}>
                        {message}
                    </p>
                )}

                {!isSuccess && (
                    <button className="register-btn" onClick={handleRegister}>
                        S'inscrire
                    </button>
                )}

                <p>Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span></p>
            </div>
        </div>
    )
}