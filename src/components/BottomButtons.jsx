import { useState } from 'react'
import { createMidi, playMidi } from '../utils/midi-playback'

const BottomButtons = () => {
    const [correct, setCorrect] = useState(null)

    const styles = {
        margin: "20px auto",
        display: "flex",
        flexDirection: "column"
    }

    const playAudio = () => {
        const midiData = createMidi()
        console.log("midiData", midiData)
        playMidi(midiData)
    }

    const handleSubmit = () => {

    }

    return (
        <div style={styles}>
            <button type="button" onClick={playAudio}>Play Audio</button>
            {<button type="button" onClick={handleSubmit}>Submit</button>}
        </div>
    )
}

export default BottomButtons