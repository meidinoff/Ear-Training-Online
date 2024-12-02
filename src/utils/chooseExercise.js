import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput, transposeExercise } from './constructExercise'
import { createMidi } from './midi-playback'

let difficulty = 1
const completedExercises = [] // Tracks exercise history to avoid repetition

export const setDifficulty = (level) => {
    // Condition ensures that difficulty can't be increased beyond what the json contains
    if (exercises[`Level ${level}`]) {
        difficulty = level
    }
}

// Randomly chooses key signature from json options based on difficulty level
const chooseKeySignature = (selectedDifficulty) => {
    const keySignatures = selectedDifficulty['key_signatures']

    return keySignatures[Math.floor(Math.random() * keySignatures.length)]
}

const randomExercise = () => {
    // Get json of exercises based on difficulty level
    const selectedDifficulty = exercises[`Level ${difficulty}`]
    const exercise_list = selectedDifficulty['exercise_list']
    const json = Object.keys(exercise_list)

    // Reset array of exercise history if there are no new exercises to choose from
    if (completedExercises.length === json.length) {
        completedExercises.length = 0
    }

    let exercise

    // Randomly chooses an exercise that the user has not already completed
    do {
        exercise = selectedDifficulty['exercise_list'][json[Math.floor(Math.random() * json.length)]]
    } while (completedExercises.includes(exercise))
    
    completedExercises.push(exercise) // Add exercise to history
        
    return { exercise: { ...exercise }, selectedDifficulty } // Deep copy to avoid mutation
}

const changeClef = (exercise) => {
    const easyClefs = ['treble', 'bass']
    const mediumClefs = ['treble', 'bass', 'alto']
    const difficultClefs = ['treble', 'bass', 'alto', 'tenor']
    let clef = ''
    let newNotes = []

    // Randomly choose clef based on difficulty
    if (difficulty < 2) {
        clef = easyClefs[Math.floor(Math.random() * easyClefs.length)]
    } else if (difficulty < 4) {
        clef = mediumClefs[Math.floor(Math.random() * mediumClefs.length)]
    } else {
        clef = difficultClefs[Math.floor(Math.random() * difficultClefs.length)]
    }

    // Shift notes into appropriate register based on selected clef
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
        const splitPitch = pitch.split('/') // Split into note name and octave number

        const octave = Number(splitPitch[1]) + octaveDisplacement // Shift octave

        // Rejoin note
        splitPitch.splice(1, 1, '/', octave)
        const newPitch = splitPitch.join('')
    
        return {'duration': 'q', 'keys': [newPitch]}
    })

    return { ...exercise, clef, notes: newNotes }
}

export const chooseExercise = (context) => {
    const { exercise, selectedDifficulty } = randomExercise()
    
    const keySignature = chooseKeySignature(selectedDifficulty)
    const newExercise = changeClef(exercise)

    // Transposes all notes into the selected key area
    transposeExercise(newExercise, keySignature)

    const midiData = createMidi(newExercise)

    const answer = constructAnswer(newExercise, keySignature, context) // Answer key for comparison
    const input = constructInput(newExercise, keySignature, context) // Version the user sees
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    return { stave, newNotes, midiData, answerNotes, exerciseData: newExercise, keySignature }
}