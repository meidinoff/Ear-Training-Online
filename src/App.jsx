import { useState } from 'react'
import './styles/App.css'
import Header from './components/Header'
import MusicControls from './components/MusicControls'
import MusicCanvas from './components/MusicCanvas'
import XPProgress from './components/xpProgress'
import Mascot from './components/Mascot'

const App = () => {
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [accidental, setAccidental] = useState('') // Input accidental
  const [redrawNote, setRedraw] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('white')
  const [isAddingXP, setIsAddingXP] = useState(false)

  return (
    <div>
      <Header />
      <div id="background" style={{ backgroundColor: backgroundColor}}>
        <div id="appArea">
            <p style={{ color: "black" }}>Input the missing note below</p>
            <div>
              <MusicControls isAnswered={isAnswered} setAccidental={setAccidental} setRedraw={setRedraw} />
              <MusicCanvas isAnswered={isAnswered} setIsAnswered={setIsAnswered} inputAccidental={accidental} resetAccidental={setAccidental} redrawNote={redrawNote} setRedraw={setRedraw} setBackgroundColor={setBackgroundColor} isCorrect={isCorrect} setIsCorrect={setIsCorrect} isAddingXP={isAddingXP} >
            
              </MusicCanvas>
              <XPProgress isCorrect={isCorrect} isAddingXP={isAddingXP} setIsAddingXP={setIsAddingXP} />
              <Mascot />
            </div>
          </div>
      </div>
    </div>
  )
}

export default App
