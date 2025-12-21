import { useState } from 'react'
import './App.css'
import WineOptions from './components/WineOptions'

function App({ onLogout }) {
  return (
    <>
      <div style={{ padding: '20px', textAlign: 'right' }}>
        <button 
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>
      <h1 className='title'>Memoria di Vino</h1>
      <WineOptions />
    </>
  )
}

export default App
