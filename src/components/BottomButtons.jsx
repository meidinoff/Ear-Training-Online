import { useState } from 'react'
import { playMidi } from '../utils/midi-playback'

const BottomButtons = ({ answered, setAnswered, questionMidi, answerMidi, answerNotes, inputNotes, setBackgroundColor, createExercise }) => {
    const [correct, setCorrect] = useState(null)
    const [midiIsPlaying, setMidiIsPlaying] = useState(false)

    const containerStyle = {
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        rowGap: "5px"
    }

    const playAudio = () => {
        if (!midiIsPlaying) {
            playMidi(questionMidi, () => setMidiIsPlaying(true), () => setMidiIsPlaying(false))
        }
    }

    const playWrongAnswer = () => {
        if (!midiIsPlaying) {
            playMidi(answerMidi, () => setMidiIsPlaying(true), () => setMidiIsPlaying(false))
        }
    }

    const returnKeysAndDur = obj => {
        const { keys, duration, ...rest } = obj
        const values = {
            keys,
            duration
        }
        return values
    }

    const arraysEqual = (array1, array2) => {
        if (array1.length !== array2.length) {
            console.log(`Array lengths differ: ${array1.length} vs ${array2.length}`)
            return false
        }

        const array2Copy = [...array2]

        for (let obj1 of array1) {
            const index = array2Copy.findIndex(obj2 => deepEqual(obj1, obj2))
            if (index === -1) {
                console.log(`No matching object found for:`, obj1)
                return false
            }
            array2Copy.splice(index, 1)
        }

        return true
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
        const answer = answerNotes.map(returnKeysAndDur)
        const input = inputNotes.map(returnKeysAndDur)

        console.log("correct answer:", answer)
        console.log("your answer:", input)

        if (arraysEqual(answer, input)) {
            setCorrect(true)
            setBackgroundColor('green')
        } else {
            setCorrect(false)
            setBackgroundColor('red')
        }
    }

    const nextQuestion = () => {
        createExercise()
        setBackgroundColor('white')
        setCorrect(null)
        setAnswered(false)
    }

    return (
        <div style={containerStyle}>
            {
                correct === null ?
                <p style={{ margin: "0 auto" }}></p> :
                <p style={{ marginTop: "0" }}>You are {correct ? "correct!" : "incorrect. Try again."}</p>
            }
            <button type="button" onClick={playAudio} disabled={midiIsPlaying}>{midiIsPlaying ? 'Playing...' : 'Play audio'}</button>
            {
            !answered ?
                <button type="button" disabled>Submit</button> :
                correct === null ?
                    <button type="button" onClick={handleSubmit}>Submit</button> :
                    correct ?
                        <button type="button" onClick={nextQuestion}>Next Question</button> :
                        <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                            <button type="button" onClick={playWrongAnswer} disabled={midiIsPlaying}>Play Your Answer</button>
                            <button type="button" onClick={handleSubmit}>Submit</button>
                        </div>
            }
        </div>
    )
}

export default BottomButtons