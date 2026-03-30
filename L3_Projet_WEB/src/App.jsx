import { Routes, Route } from 'react-router-dom'

import Header from './components/layout/header/Header'
import ContentArea from './components/layout/ContentArea'

// import Page_principale from './componant/Page_principale'
// import  Connexion  from './componant/Connexion'
// import Page_principale_connecté from './componant/Page_principale_connecté'
// import Enregistrement from './componant/Enregistrement'

import './App.css'

function App() {

  return (
    <div className='app'>
      <Header />
      <ContentArea />
      {/* {page === "principale" && <Page_principale onNavigate={setPage}/>} */}

      {/* {page === "connexion" && <Connexion onNavigate={setPage}/>} */}

      {/* {page === "principale_connecté" && <Page_principale_connecté onNavigate={setPage}/>} */}

      {/* {page === "enregistrement" && <Enregistrement onNavigate={setPage}/>} */}
      </div>
   )
}

export default App
