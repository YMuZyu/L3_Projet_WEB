import Page_principale from './componant/Page_principale'
import  Connexion  from './componant/Connexion'
import Page_principale_connecté from './componant/Page_principale_connecté'
import Enregistrement from './componant/Enregistrement'
import './App.css'
import { useState } from 'react'

function App() {
  const [page, setPage] = useState('principale')
  // const [user, setUser] = useState(null)


  // const handleLogin = (userData) => {
  //   setUser(userData)
  //   setPage('principale_connecté') // Retour à l'accueil après connexion
  // }

  return (
    <div className="App">

      {page === "principale" && <Page_principale /*user={user}*/ onNavigate={setPage}/>}

      {page === "connexion" && <Connexion onNavigate={setPage}/>}

      {page === "principale_connecté" && <Page_principale_connecté /*user={user}*/ onNavigate={setPage}/>}

      {page === "enregistrement" && <Enregistrement onNavigate={setPage}/>}

    </div>
   )
}

export default App
