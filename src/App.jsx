import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MusicControls from './components/MusicControls'
import MusicCanvas from './components/MusicCanvas'
import TestRender from './components/TestRender'

const App = () => {
  const [answered, setAnswered] = useState(false)
  const [accidental, setAccidental] = useState('')
  const [redrawNote, setRedraw] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('white')

  return (
    <div style={{ backgroundColor: backgroundColor}}>
      <Header />
      <p style={{ marginTop: "90px", color: "black" }}>Input the missing note below</p>
      <div>
        <MusicControls answered={answered} setAccidental={setAccidental} setRedraw={setRedraw} />
        <MusicCanvas answered={answered} setAnswered={setAnswered} inputAccidental={accidental} resetAccidental={setAccidental} redrawNote={redrawNote} setRedraw={setRedraw} setBackgroundColor={setBackgroundColor}>
          
        </MusicCanvas>
      </div>
    </div>
  )
}

export default App
