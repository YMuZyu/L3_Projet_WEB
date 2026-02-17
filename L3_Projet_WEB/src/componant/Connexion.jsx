import '../resources/connexion.css'



export function Connexion() {
    return (
        <>
            <header>
                <h1>Page de connexion</h1>
            </header>
            <form>
                <div className="entrer">
                    <label htmlFor="Methode_de_connexion">Utilisateur</label> {/*Label, quand on click sur le nom, le label ça nous renvoie au l'élément désigné par l'id*/}
                    <input type="text" placeholder="Methode_de_connexion" id="Methode_de_connexion"/>
                    <label htmlFor="Mot_de_passe">Mot de passe</label>
                    <input type="password" placeholder="Mot de passe" id="Mot_de_passe"/>
                </div>
                <div className="action">
                    <button id="loginButton">Se connecter</button>
                    <button id="cancelButton">Annuler</button>
                </div>
            </form>
        </>
    );
}