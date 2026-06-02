import AppLayout from './components/layout/AppLayout'

export default function App() {
  /*
  useEffect(()=>{
    fetch("http://localhost:10000/connexion",{
      credentials:"include" //demande d'envoyer les cookies dont notre connexion
    })
    .then(res => res.json())
    .then(data=>{
      setIsLogged(data.logged);
    })
  },[]);
  */

  return <AppLayout />
}
