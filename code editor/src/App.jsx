import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Editor from './Components/Editor'
import Sidebar from './Components/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex'>
      <Sidebar />
      <Editor />

    </div>
  )
}

export default App
