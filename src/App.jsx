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
            background: 'beige',
            color: '#b17428',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: '"Marck Script", cursive'
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
