import '../resources/connexion.css'
import mascotte from '../resources/Lin_Ma_projet.png'



export default function Connexion(props) {
    return (
        <>
            <div id = "mascotte">
                    <img src={mascotte} alt="Mascotte provisoire" />
            </div>
            <header>
                <h1>Page de connexion</h1>
                
            </header>
            <form>
                <div className="entrer">
                    <label htmlFor="Methode_de_connexion">Utilisateur</label>
                    <input type="text" placeholder="Methode_de_connexion" id="Methode_de_connexion"/>
                    <label htmlFor="Mot_de_passe">Mot de passe</label>
                    <input type="password" placeholder="Mot de passe" id="Mot_de_passe"/>
                </div>
                <div className="action">
                    <button onClick={()=> props.onNavigate("principale_connecté")}>Se connecter</button>
                    <button onClick={() => props.onNavigate("principale")}>Annuler</button>
                </div>
            </form>
        </>
    );
}