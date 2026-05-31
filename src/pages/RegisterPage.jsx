import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/pages/RegisterPage.css'


const isPasswordStrong = (password) => {
    //on veut faire en sorte que les mdps soit assez efficace c'est a dire qu'au moins une minuscule, une majuscule, un chiffre et au moins 10 caractère 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
    return regex.test(password);
};
 

function Register() {

    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleRegister = async () => {

        //vérifications:

        if(!login || !password || !password2){
            setMessage("Veuillez remplir les champs");
            return;
        }

        if(password != password2){
            setMessage("Les mots de passe ne correspondent pas");
            return;
        }

        if(!isPasswordStrong(password)){
            setMessage("Le mot de passe n'est pas assez puissant.\n Veillez mettre au moins une minuscule, une majuscule, un chiffre avec une longueur de 10 caractère ");
            return;
        }

        //Communication avec base de données
        try {
        //envoi de requete
            const response = await fetch("http://localhost:10000/user", {
                method: "PUT",
                //précision du type d'envoie
                headers: {
                "Content-Type": "application/json"
                },
                // transformation de l'objet JS en texte JSON
                body: JSON.stringify({
                login,
                password,
                password2
                })
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.status === 201){
                setTimeout(()=>{
                    navigate("/login");
                },1000) //le delay j'ai mis 1000 pour le moment mais modifiable
            }
        } 

        catch (error) {
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
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={()=>setShowPassword(!showPassword)}> o_O </button>
        

        <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
        />
        <button onClick={()=>setShowPassword2(!showPassword2)}> o_O </button>

        <button onClick={handleRegister}>S'inscrire</button>

        <p>{message}</p>
        </div>
    );
    }

    export default Register;