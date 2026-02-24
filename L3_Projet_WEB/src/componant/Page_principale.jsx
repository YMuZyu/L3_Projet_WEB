import "../resources/Page_principale.css"
import logo from "../resources/Sciences_SU.png"

export default function Page_principale(props) {
  return (
    <>
      <header className="main-header">
        <div className="logo-container">
          <img src={logo} alt="Logo du forum" />
        </div>

        <div className="search-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Rechercher des messages..." 
              aria-label="Recherche"
            />
            <button type="submit">Rechercher</button>
          </form>
        </div>

        <div className="auth-links">
          <button onClick={() => props.onNavigate("connexion")}>
            Connexion
          </button>
          <button onClick={() => props.onNavigate("enregistrement")}>
            Enregistrement
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="left-column">
          <section className="new-message-section">
            <h2>Nouveau message</h2>
            <form>
              <input
                type="text"
                placeholder="Sujet"
                aria-label="Sujet du message"
              />
              <textarea
                placeholder="Votre message..."
                aria-label="Contenu du message"
              ></textarea>
              <button type="submit">Publier</button>
            </form>
          </section>

          <section className="messages-list-section">
            <h2>Messages récents</h2>
            <ul className="messages-list">
              <li>
                <div className="message-subject">Sujet 1</div>
                <div className="message-content">
                  Ceci est le contenu du message 1.
                </div>
              </li>
              <li>
                <div className="message-subject">Sujet 2</div>
                <div className="message-content">
                  Ceci est le contenu du message 2.
                </div>
              </li>
              <li>
                <div className="message-subject">Sujet 3</div>
                <div className="message-content">
                  Ceci est le contenu du message 3.
                </div>
              </li>
            </ul>
          </section>
        </div>

        <aside className="info-section">
          <h3>Informations du forum</h3>
          <p>Bienvenue sur notre forum de discussion !</p>
          <p>👋 On aime tous RODIIIIII !</p>
          <p>📝 N'hésitez pas à participer aux discussions</p>
          <p>🔔 Restez informés des derniers messages</p>
        </aside>
      </main>
    </>
  )
}