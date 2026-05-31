import { useState, useEffect, createContext } from "react"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [roles, setRoles] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:10000/user/me", {
                    credentials: "include"
                })
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                    setRoles(data.roles || [])
                    setToken(data.token || null)
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
        setRoles(userData.roles || [])
        setToken(userData.token || null)
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
            setRoles([])
            setToken(null)
            setIsAuthenticated(false)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            roles,
            isAuthenticated,
            token,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}