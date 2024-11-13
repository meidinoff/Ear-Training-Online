import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput } from './constructExercise'
import { createMidi } from './midi-playback'

let difficulty = 1
const completedExercises = []

export const setDifficulty = (level) => {
    if (exercises[`Level ${level}`]) {
        difficulty = level
    }
    
    console.log("difficulty:", difficulty)
}

const randomExercise = () => {
    const selectedDifficulty = exercises[`Level ${difficulty}`]
    const json = Object.keys(selectedDifficulty)
    console.log("json", json)

    if (completedExercises.length === json.length) {
        completedExercises.length = 0
    }

    console.log("completed exercises:", completedExercises)
    const exercise = selectedDifficulty[json[Math.floor(Math.random() * json.length)]]

    if (completedExercises.includes(exercise)) {
        return randomExercise()
    } else {
        completedExercises.push(exercise)
        return exercise
    }
}

export const chooseExercise = (context) => {
    const exercise = randomExercise()
    console.log("chosen exercise", exercise)
    console.log("exercises length", Object.keys(exercises).length)

    const midiData = createMidi(exercise)

    const answer = constructAnswer(exercise, context)
    const input = constructInput(exercise, context)
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    return { stave, newNotes, midiData, answerNotes, exerciseData: exercise }
}