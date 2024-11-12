import { useState } from 'react'
import './styles/App.css'
import MusicControls from './components/MusicControls'
import MusicCanvas from './components/MusicCanvas'
import XPProgress from './components/xpProgress'
//import { calculateInterval, findByInterval } from './music_knowledge/intervals'

const App = () => {
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(null)
  const [accidental, setAccidental] = useState('')
  const [redrawNote, setRedraw] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('white')
  const [addingXP, setAddingXP] = useState(false)

  return (
    <div>
      <header>
        <div style={{ display: "flex" }}>
          <h1 style={{ fontSize: "36px" }}>Aural Skills Training</h1>
          <div id="menu-bar" style={{ display: "flex" }}>
            <a href="">About</a>
            <a href="">GitHub</a>
          </div>
        </div>
      </header>
      <div id="background" style={{ backgroundColor: backgroundColor}}>
        <div id="appArea">
          <p style={{ color: "black" }}>Input the missing note below</p>
          <div>
            <MusicControls answered={answered} setAccidental={setAccidental} setRedraw={setRedraw} />
            <MusicCanvas answered={answered} setAnswered={setAnswered} inputAccidental={accidental} resetAccidental={setAccidental} redrawNote={redrawNote} setRedraw={setRedraw} setBackgroundColor={setBackgroundColor} correct={correct} setCorrect={setCorrect} addingXP={addingXP}>
          
            </MusicCanvas>
            <XPProgress correct={correct} addingXP={addingXP} setAddingXP={setAddingXP} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
