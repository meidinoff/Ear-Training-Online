import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput, transposeExercise } from './constructExercise'
import { createMidi } from './midi-playback'

let difficulty = 1
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

const changeClef = (exercise) => {
    const easyClefs = ['treble', 'bass']
    const mediumClefs = ['treble', 'bass', 'alto']
    const difficultClefs = ['treble', 'bass', 'alto', 'tenor']
    let clef = ''
    let newNotes = []

    if (difficulty < 2) {
        clef = easyClefs[Math.floor(Math.random() * easyClefs.length)]
    } else if (difficulty < 4) {
        clef = mediumClefs[Math.floor(Math.random() * mediumClefs.length)]
    } else {
        clef = difficultClefs[Math.floor(Math.random() * difficultClefs.length)]
    }

    console.log("choosen clef:", clef)
    let octaveDisplacementOptions = []

    switch (clef) {
        case 'bass':
            octaveDisplacementOptions = [-1, -2]
            break
        case 'alto':
            octaveDisplacementOptions = [0, -1]
            break
        case 'tenor':
            octaveDisplacementOptions = [0, -1]
            break
        default:
            octaveDisplacementOptions = [0, 1]
    }

    const octaveDisplacement = octaveDisplacementOptions[Math.floor(Math.random() * octaveDisplacementOptions.length)]

    newNotes = exercise.notes.map(note => {
        const pitch = note.keys[0]
        const splitPitch = pitch.split('/')
        const octave = Number(splitPitch[1]) + octaveDisplacement
        splitPitch.splice(1, 1, '/', octave)
        const newPitch = splitPitch.join('')
    
        return {'duration': 'q', 'keys': [newPitch]}
    })

    console.log("NEW NOTES", newNotes)

    exercise.clef = clef
    exercise.notes = newNotes

    console.log("NEW EXERCISE", exercise)

    return exercise
}

export const chooseExercise = (context) => {
    const { exercise, selectedDifficulty } = randomExercise()
    const keySignature = chooseKeySignature(selectedDifficulty)
    const newExercise = changeClef(exercise)
    console.log("chosen exercise", exercise)
    console.log("exercises length", Object.keys(exercises).length)

    transposeExercise(newExercise, keySignature)

    const midiData = createMidi(newExercise)

    const answer = constructAnswer(newExercise, keySignature, context)
    const input = constructInput(newExercise, keySignature, context)
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    console.log("answer notes", answerNotes)

    return { stave, newNotes, midiData, answerNotes, exerciseData: newExercise, keySignature }
}