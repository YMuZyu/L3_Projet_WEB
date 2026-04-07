import { Routes, Route } from 'react-router-dom'

import Header from './components/layout/header/Header'
import ContentArea from './components/layout/ContentArea'

import './App.css'

export default function App() {

  return (
    <div className='app'>
      <Header />
      <ContentArea />
    </div>
   )
}
