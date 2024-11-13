import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput } from './constructExercise'
import { createMidi } from './midi-playback'

let difficulty = 1

export const setDifficulty = (level) => {
    difficulty = level
    console.log("difficulty:", difficulty)
}

export const chooseExercise = (context) => {
    const selectedDifficulty = exercises[`Level ${difficulty}`]
    const json = Object.keys(selectedDifficulty)
    console.log("json", json)
    const exercise = selectedDifficulty[json[Math.floor(Math.random() * json.length)]]
    console.log("exercises length", Object.keys(exercises).length)

    const midiData = createMidi(exercise)

    const answer = constructAnswer(exercise, context)
    const input = constructInput(exercise, context)
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    return { stave, newNotes, midiData, answerNotes, exerciseData: exercise }
}