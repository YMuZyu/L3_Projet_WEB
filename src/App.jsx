import Header from './components/layout/header/Header'
import ContentArea from './components/layout/contentArea/ContentArea'

import './App.css'
import { useState } from 'react';
import { useEffect } from 'react';

export default function App() {

  const [isLogged, setIsLogged] = useState(false);

  useEffect(()=>{
    fetch("http://localhost:10000/connexion",{
      credentials:"include" //demande d'envoyer les cookies dont notre connexion
    })
    .then(res => res.json())
    .then(data=>{
      setIsLogged(data.logged);
    })
  },[]);


  return (
    <div className='app'>
      <Header isLogged={isLogged}/>
      <ContentArea 
        isLogged={isLogged} 
        onLoginSuccess={() => setIsLogged(true)}
        onLogout={() => setIsLogged(false)}
      />
    </div>
   )
}
