import { useState } from 'react'
import './styles/App.css'
import Header from './components/Header'
import MusicControls from './components/MusicControls'
import MusicCanvas from './components/MusicCanvas'
import XPProgress from './components/xpProgress'
import Mascot from './components/Mascot'

const App = () => {
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(null)
  const [accidental, setAccidental] = useState('')
  const [redrawNote, setRedraw] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('white')
  const [addingXP, setAddingXP] = useState(false)

  return (
    <div>
      <Header />
      <div id="background" style={{ backgroundColor: backgroundColor}}>
        <div id="appArea">
            <p style={{ color: "black" }}>Input the missing note below</p>
            <div>
              <MusicControls answered={answered} setAccidental={setAccidental} setRedraw={setRedraw} />
              <MusicCanvas answered={answered} setAnswered={setAnswered} inputAccidental={accidental} resetAccidental={setAccidental} redrawNote={redrawNote} setRedraw={setRedraw} setBackgroundColor={setBackgroundColor} correct={correct} setCorrect={setCorrect} addingXP={addingXP} >
            
              </MusicCanvas>
              <XPProgress correct={correct} addingXP={addingXP} setAddingXP={setAddingXP} />
              <Mascot />
            </div>
          </div>
      </div>
    </div>
  )
}

export default App
