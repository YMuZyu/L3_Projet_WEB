import "../resources/Page_principal.css"
import logo from "../resources/Sciences_SU.png"
import { Connexion } from "./Connexion"


export default function Page_principale() {


  return (
    <>
      <h1>Nom Forum</h1>

      <header>
        <div id="logo">
          <img src={logo} alt="Logo du forum" />
        </div>

        <div id="search">
          <input type="text" placeholder="Zone Recherche" />
          <button type="submit">Recherche</button>
        </div>

        <div id="liens">
          <div id="lien-connexion">
            <button onClick={() => window.location.href = "../ressources/connexion.html"}> Connexion
            </button>
          </div>

          <div id="lien-deconnexion">
            <a href="#">Déconnexion</a>
          </div>

          <div id="lien-enregistrement">
            <a href="#">Enregistrement</a>
          </div>
        </div>
      </header>

      <section className="main-content">
        <h2>Contenu Principal</h2>

        <div className="new-msg">
          <input
            id="nouveau_message"
            name="nouveau_message"
            type="text"
            placeholder="Nouveau message"
          />
          <button type="submit">Envoyer</button>
        </div>

        <div className="Liste-des-messages">
          <ul id="liste-message" className="liste-message"></ul>
        </div>

        <h2>Informations</h2>
      </section>

      <div className="contenu">
        <div id="infomation">
          <h3>Informations du forum</h3>
          <p>Bienvenue sur notre forum de discussion !</p>
          <p>On aime tous RODIIIIII !</p>
        </div>

        <div id="newMessage">
          <h3>Nouveau message</h3>
          <form>
            <label htmlFor="sujet">Sujet :</label><br />
            <input type="text" id="sujet" name="sujet" /><br /><br />

            <label htmlFor="message">Message :</label><br />
            <textarea id="message" name="message" rows="4" cols="50"></textarea><br /><br />

            <input type="submit" value="Envoyer" />
          </form>
        </div>

        <div id="listeMessages">
          <h3>Liste des messages</h3>
          <ul>
            <li><strong>Sujet 1 :</strong> Ceci est le contenu du message 1.</li>
            <li><strong>Sujet 2 :</strong> Ceci est le contenu du message 2.</li>
            <li><strong>Sujet 3 :</strong> Ceci est le contenu du message 3.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
