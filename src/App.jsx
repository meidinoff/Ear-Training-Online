import { useState } from 'react'
import './App.css'
import MusicCanvas from './components/MusicCanvas'
import BottomButtons from './components/BottomButtons'
import TestRender from './components/TestRender'

const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <div>
      <div>
        <MusicCanvas>
          <BottomButtons />
        </MusicCanvas>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/soundfont-player/0.21.3/soundfont-player.min.js"></script>
    </div>
  )
}

export default App
