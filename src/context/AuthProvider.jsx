// Gère l'état de connexion global de l'application
// Tous les composants peuvent accéder à l'utilisateur connecté via useContext(AuthContext)

import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Au chargement de la page, on vérifie si une session existe déjà
    // (par exemple si l'utilisateur a rechargé la page)
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("/user/me", {
                    credentials: "include" // envoie le cookie de session
                })
                if (response.ok) {
                    const data = await response.json()
                    // On accepte seulement les utilisateurs validés ou admins
                    if (data.user.isValidated || data.user.isAdmin) {
                        setUser(data.user)
                        setIsAuthenticated(true)
                    }
                }
            } catch (err) {
                console.error("Erreur session:", err)
            } finally {
                // Dans tous les cas, on arrête le chargement
                setIsLoading(false)
            }
        }
        checkSession()
    }, [])

    // Appelé après un login réussi depuis LoginPage
    const login = (userData) => {
        setUser(userData.user)
        setIsAuthenticated(true)
    }

    // Met à jour l'avatar dans le contexte global (header, UserButton, etc.)
    const updateAvatar = (newAvatar) => {
        setUser(prev => ({ ...prev, avatar: newAvatar }))
    }

    // Appelé quand l'utilisateur clique sur "Déconnexion"
    // On détruit la session côté serveur puis on réinitialise l'état local
    const logout = async () => {
        try {
            await fetch("http://localhost:10000/user/logout", {
                method: "POST",
                credentials: "include"
            })
        } catch (err) {
            console.error("Erreur logout:", err)
        } finally {
            setUser(null)
            setIsAuthenticated(false)
            navigate("/") //redirection vers l'accueil
        }
    }

    return (
        // On expose les données et fonctions utiles à toute l'application
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isAdmin: user?.isAdmin || false, // raccourci pour éviter user?.isAdmin partout
            isValidated: user?.isValidated || false, // raccourci pour savoir si le compte est validé
            login,
            logout,
            updateAvatar
        }}>
            {children}
        </AuthContext.Provider>
    )
}