import { useState } from 'react'
import React from 'react'
import { Home } from './pages/home'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Home />

      </div>


    </>
  )
}

export default App
