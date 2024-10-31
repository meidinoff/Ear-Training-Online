import { useState } from 'react'
import './App.css'
import MusicCanvas from './components/MusicCanvas'
import TestRender from './components/TestRender'

const App = () => {
  // const [count, setCount] = useState(0)
  //const divId = "canvas"
  //const divElement = document.getElementById(divId)


  return (
    <div>
      <div>
        <MusicCanvas>
          <p>this is some test</p>
        </MusicCanvas>
      </div>
    </div>
  )
}

export default App
