import '../resources/enregistrement.css'
import Page_principale_connecté from './Page_principale_connecté';

export default function Enregistrement(props) {
    return (
        <>  
        <body>
            <h1>Enregistrement</h1>
            <form method="POST" action="javascript:connexion" >
                <div class="name">
                    <div class="prenom">
                        <label for="prenom">Prénom</label>
                    <input id="prenom" name="prenom" type="text" required></input>
                    </div>
                    <div>
                    <div class="nom">
                        <label for="nom">Nom</label>
                        <input id="nom" name="nom" type="text" required></input>
                    </div>
                    </div> 
                </div>
                

                <div class="field">
                    <label for="login">Login</label>
                    <input id="login" name="username" type="text" required></input>
                </div>
                
                <div class="field">
                    <label for="password">Mot de passe</label>
                    <input id="password" name="password" type="password" required></input>
                </div>

                <div class="field">
                    <label for="retapez">Retapez</label>
                    <input id="retapez" name="password" type="password" required></input>
                </div>
                
                <div class="actions">
                    <button onClick={()=>props.onNavigate("principale_connecté")}>Enregistrer</button>
                    <button onClick={()=>props.onNavigate("principale")}>Annuler</button>
                </div>
            </form>
        </body>
        </>
    );
}