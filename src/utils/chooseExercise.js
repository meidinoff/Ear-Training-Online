import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput, transposeExercise } from './constructExercise'
import { createMidi } from './midi-playback'

let difficulty = 4
const completedExercises = []

export const setDifficulty = (level) => {
    if (exercises[`Level ${level}`]) {
        difficulty = level
    }
    
    console.log("difficulty:", difficulty)
}

const chooseKeySignature = (selectedDifficulty) => {
    const keySignatures = selectedDifficulty['key_signatures']

    return keySignatures[Math.floor(Math.random() * keySignatures.length)]
}

const randomExercise = () => {
    const selectedDifficulty = exercises[`Level ${difficulty}`]
    const exercise_list = selectedDifficulty['exercise_list']
    const json = Object.keys(exercise_list)
    console.log("json", json)

    if (completedExercises.length === json.length) {
        completedExercises.length = 0
    }

    console.log("completed exercises:", completedExercises)
    const exercise = selectedDifficulty['exercise_list'][json[Math.floor(Math.random() * json.length)]]
    console.log("exercise: ", exercise)

    if (completedExercises.includes(exercise)) {
        return randomExercise()
    } else {
        completedExercises.push(exercise)
        return { exercise, selectedDifficulty }
    }
}

export const chooseExercise = (context) => {
    const { exercise, selectedDifficulty } = randomExercise()
    const keySignature = chooseKeySignature(selectedDifficulty)
    console.log("chosen exercise", exercise)
    console.log("exercises length", Object.keys(exercises).length)

    transposeExercise(exercise, keySignature)

    const midiData = createMidi(exercise)

    const answer = constructAnswer(exercise, keySignature, context)
    const input = constructInput(exercise, keySignature, context)
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    console.log("answer notes", answerNotes)

    return { stave, newNotes, midiData, answerNotes, exerciseData: exercise, keySignature }
}