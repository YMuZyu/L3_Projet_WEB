import { useState } from "react";

import './RegisterPage.css'


function Register() {


    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        try {
        const response = await fetch("http://localhost:10000/user", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            login,
            password,
            password2
            })
        });

        const data = await response.json();
        setMessage(data.message);
        } catch (error) {
        setMessage("Erreur de connexion au serveur");
        console.error(error);
        }
    };

    return (
        <div>
        <h2>Inscription</h2>

        <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
        />

        <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
        />

        <button onClick={handleRegister}>S'inscrire</button>

        <p>{message}</p>
        </div>
    );
    }

    export default Register;