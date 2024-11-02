import { useState } from 'react'
import { playMidi } from '../utils/midi-playback'

const BottomButtons = ({ answered, questionMidi, answerMidi }) => {
    const [correct, setCorrect] = useState(null)

    const containerStyle = {
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        rowGap: "5px"
    }

    const playAudio = () => {
        playMidi(questionMidi)
    }

    const playWrongAnswer = () => {
        playMidi(answerMidi)
    }

    const deepEqual = (obj1, obj2) => {
        if (obj1 === obj2) return true

        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false
        }

        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)

        for (let key of keys1) {
            if (!keys2.includes(key)) {
                return false
            }
            if (!deepEqual(obj1[key], obj2[key])) {
                return false
            }
        }

        return true
    }

    const handleSubmit = () => {
        deepEqual(questionMidi, answerMidi) ?
            setCorrect(true) :
            setCorrect(false)
    }

    return (
        <div style={containerStyle}>
            {
                correct === null ?
                <p style={{ margin: "0 auto" }}></p> :
                <p style={{ marginTop: "0" }}>You are {correct ? "correct!" : "incorrect. Try again."}</p>
            }
            <button type="button" onClick={playAudio}>Play Audio</button>
            {
            !answered ?
                <button type="button" disabled>Submit</button> :
                correct === null ?
                    <button type="button" onClick={handleSubmit}>Submit</button> :
                    correct ?
                        <button type="button">Next Question</button> :
                        <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                            <button type="button" onClick={playWrongAnswer}>Play Your Answer</button>
                            <button type="button" onClick={handleSubmit}>Submit</button>
                        </div>
            }
        </div>
    )
}

export default BottomButtons