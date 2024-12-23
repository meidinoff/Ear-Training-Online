import { useState, useEffect } from 'react'
import { playMidi } from '../utils/midi-playback'

const BottomButtons = ({ isAnswered, setIsAnswered, questionMidi, answerMidi, answerNotes, inputNotes, setBackgroundColor, createExercise, isCorrect, setIsCorrect, isAddingXP }) => {
    const [midiIsPlaying, setMidiIsPlaying] = useState(false)
    const [questionIsPlaying, setQuestionIsPlaying] = useState(false)
    const [wrongAnswerIsPlaying, setWrongAnswerIsPlaying] = useState(false)

    useEffect(() => {
        const nextButton = document.querySelector('.nextButton')

        // Prevent moving to next exercise until xp bar animation is over
        if (nextButton) {
            if (isAddingXP) {
                nextButton.disabled = true
            } else {
                setTimeout(() => {
                    nextButton.disabled = false
                }, 500)
            }
        }
    }, [isAddingXP])

    const containerStyle = {
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        rowGap: "5px"
    }

    // Play the notes that the user should dictate
    const playAudio = () => {
        // MIDI playback can only begin if MIDI is not already playing back
        if (!midiIsPlaying) {
            playMidi(questionMidi, 
                () => {
                    setMidiIsPlaying(true)
                    setQuestionIsPlaying(true)
                }, 
                () => {
                    setMidiIsPlaying(false)
                    setQuestionIsPlaying(false)
                })
        }
    }

    // If user is incorrect, allow playback of their guess
    const playWrongAnswer = () => {
        if (!midiIsPlaying) {
            playMidi(answerMidi, 
                () => {
                    setMidiIsPlaying(true)
                    setWrongAnswerIsPlaying(true)
                }, 
                () => {
                    setMidiIsPlaying(false)
                    setWrongAnswerIsPlaying(false)
                })
        }
    }

    const returnKeysAndDur = obj => {
        const { keys, duration, ...rest } = obj

        const newKeys = keys.map(key => {
            const splitKey = key.split('/')
            const letterName = splitKey[0].split('')

            // Remove natural 'n' symbol for VexFlow 'key'
            if (letterName.length > 1 && letterName[1] === 'n') {
                letterName.splice(1, letterName.length - 1)
                const joinedLetterName = letterName.join('')
                splitKey.splice(0, 1, joinedLetterName, '/')
                return splitKey.join('')
            } else {
                return key
            }
        })

        const values = {
            keys: newKeys,
            duration
        }
        return values
    }

    // Array comparison
    const arraysEqual = (array1, array2) => {
        // Must be same length
        if (array1.length !== array2.length) {
            console.log(`Array lengths differ: ${array1.length} vs ${array2.length}`)
            return false
        }

        const array2Copy = [...array2]

        // Check each index for deep equality
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
        // Check and compare answer key with user input
        const answer = answerNotes.map(returnKeysAndDur)
        const input = inputNotes.map(returnKeysAndDur)

        // TODO: Add sound effects for submit button feedback (depending on correctness)

        if (arraysEqual(answer, input)) {
            setIsCorrect(true)
            setBackgroundColor('rgb(60, 200, 30)')
        } else {
            setIsCorrect(false)
            setBackgroundColor('rgb(200, 50, 70)')
        }
    }

    // Choose new exercise and reset appearance
    const nextQuestion = () => {
        createExercise()
        setBackgroundColor('white')
        setIsCorrect(null)
        setIsAnswered(false)
    }

    return (
        <div style={containerStyle}>
            {
                isCorrect === null ?
                <p style={{ margin: "0 auto" }}></p> :
                <p style={{ marginTop: "0" }}>You are {isCorrect ? "correct!" : "incorrect. Try again."}</p>
            }
            <button type="button" onClick={playAudio} disabled={midiIsPlaying}>{questionIsPlaying ? 'Playing...' : 'Play audio'}</button>
            {
            !isAnswered ?
                <button type="button" disabled>Submit</button> :
                isCorrect === null ?
                    <button type="button" onClick={handleSubmit}>Submit</button> :
                    isCorrect ?
                        <button className="nextButton" type="button" onClick={nextQuestion}>Next Question</button> :
                        <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                            <button type="button" onClick={playWrongAnswer} disabled={midiIsPlaying}>{wrongAnswerIsPlaying ? 'Playing...' : 'Play Your Answer'}</button>
                            <button type="button" onClick={handleSubmit}>Submit</button>
                        </div>
            }
        </div>
    )
}

export default BottomButtons