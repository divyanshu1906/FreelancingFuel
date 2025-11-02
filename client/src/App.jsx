import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from "./router/router1";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <RouterProvider router={router} />
  )
}

export default App
