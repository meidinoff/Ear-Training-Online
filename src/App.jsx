import { useState } from 'react'
import './App.css'
import MusicControls from './components/MusicControls'
import MusicCanvas from './components/MusicCanvas'
import TestRender from './components/TestRender'

const App = () => {
  const [answered, setAnswered] = useState(false)
  const [accidental, setAccidental] = useState('')
  const [redrawNote, setRedraw] = useState(false)

  return (
    <div>
      <div>
        <MusicControls answered={answered} setAccidental={setAccidental} setRedraw={setRedraw} />
        <MusicCanvas answered={answered} setAnswered={setAnswered} inputAccidental={accidental} resetAccidental={setAccidental} redrawNote={redrawNote} setRedraw={setRedraw}>
          
        </MusicCanvas>
      </div>
    </div>
  )
}

export default App
