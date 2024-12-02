import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput, transposeExercise } from './constructExercise'
import { createMidi } from './midi-playback'

let difficulty = 1
const completedExercises = []

export const setDifficulty = (level) => {
    if (exercises[`Level ${level}`]) {
        difficulty = level
    }
}

const chooseKeySignature = (selectedDifficulty) => {
    const keySignatures = selectedDifficulty['key_signatures']

    return keySignatures[Math.floor(Math.random() * keySignatures.length)]
}

const randomExercise = () => {
    const selectedDifficulty = exercises[`Level ${difficulty}`]
    const exercise_list = selectedDifficulty['exercise_list']
    const json = Object.keys(exercise_list)

    if (completedExercises.length === json.length) {
        completedExercises.length = 0
    }

    let exercise

    do {
        console.log("Choose!")
        exercise = selectedDifficulty['exercise_list'][json[Math.floor(Math.random() * json.length)]]
    } while (completedExercises.includes(exercise))
    
    completedExercises.push(exercise)
    console.log(completedExercises)
        
    return { exercise: { ...exercise }, selectedDifficulty }
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

    console.log("octaveDisplacementOptions:", octaveDisplacementOptions)
    const octaveDisplacement = octaveDisplacementOptions[Math.floor(Math.random() * octaveDisplacementOptions.length)]
    console.log("octaveDisplacement:", octaveDisplacement)

    newNotes = exercise.notes.map(note => {
        const pitch = note.keys[0]
        const splitPitch = pitch.split('/')
        console.log("splitPitch:", splitPitch)
        const octave = Number(splitPitch[1]) + octaveDisplacement
        console.log("octave:", octave)
        splitPitch.splice(1, 1, '/', octave)
        const newPitch = splitPitch.join('')
    
        return {'duration': 'q', 'keys': [newPitch]}
    })


    // exercise.clef = clef
    // exercise.notes = newNotes


    return { ...exercise, clef, notes: newNotes }
}

export const chooseExercise = (context) => {
    const { exercise, selectedDifficulty } = randomExercise()
    console.log("Original:", exercise)
    const keySignature = chooseKeySignature(selectedDifficulty)
    const newExercise = changeClef(exercise)
    console.log("New:", newExercise)

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