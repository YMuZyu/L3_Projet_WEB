// Gère l'état de connexion global de l'application
// Tous les composants peuvent accéder à l'utilisateur connecté via useContext(AuthContext)

import { useState, useEffect, createContext } from "react"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Au chargement de la page, on vérifie si une session existe déjà
    // (par exemple si l'utilisateur a rechargé la page)
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:10000/user/me", {
                    credentials: "include" // envoie le cookie de session
                })
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                    setIsAuthenticated(true)
                }
            } catch (err) {
                console.error("Erreur session:", err)
            } finally {
                setIsLoading(false)
            }
        }
        checkSession()
    }, [])

    const login = (userData) => {
        setUser(userData.user)
        setIsAuthenticated(true)
    }

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
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isAdmin: user?.isAdmin || false,
            isValidated: user?.isValidated || false,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}