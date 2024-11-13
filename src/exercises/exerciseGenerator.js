import fs from 'fs'
//import { findByInterval, calculateInterval } from '../music_knowledge/intervals'
import scales from '../music_knowledge/scales.js'

const noteMap = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

const getRandomNote = () => {
    const note = noteMap[Math.floor(Math.random() * noteMap.length)];
    const octave = Math.floor(Math.random() * 2) + 4; // Generate notes between octave 4 and 5
    return `${note}/${octave}`;
};

const generateRandomExercise = () => {
    // const timeSignatures = ['4/4', '3/4', '2/4'];
    // const randomTimeSignature = timeSignatures[Math.floor(Math.random() * timeSignatures.length)];

    const exercise = {
        clef: 'treble',
        time_signature: '',
        notes: []
    };

    for (let i = 0; i < 3; i++) { // Generate 3 notes per exercise
        const note = getRandomNote();
        const duration = 'q';
        exercise.notes.push({ keys: [note], duration: duration });
    }

    exercise.time_signature = `${exercise.notes.length}/4`

    return exercise;
};

const getTonalNote = (scaleDegrees, octaveOptions, index, finalIndex) => {
    const majorScale = scales.majorScale
    const noteOptions = majorScale
        .filter(note => scaleDegrees.includes(note))
        .map(note => majorScale.indexOf(note))

    console.log("note option indexes: ", noteOptions)

    if ((index - 1) === 0) {
        const note = noteMap[Math.floor(Math.random() * noteOptions.length)]
        const octave = octaveOptions[Math.floor(Math.random() * octaveOptions.length)]
        console.log("2nd note:", `${note}/${octave}`)
        return `${note}/${octave}`
    } else if (index === finalIndex) {
        const octave = octaveOptions[Math.floor(Math.random() * octaveOptions.length)]
        console.log("final note:", `${noteMap[0]}/${octave}`)
        return `${noteMap[0]}/${octave}`
    } else {
        const note = noteMap[Math.floor(Math.random() * noteOptions.length)]
        const octave = octaveOptions[Math.floor(Math.random() * octaveOptions.length)]
        console.log("note:", `${note}/${octave}`)
        return `${note}/${octave}`
    }
}

const generateTonalExercise = (difficulty, noteNumber) => {
    const clef = 'treble'
    const rootNote = 'c'
    
    const exercise = {
        clef: clef,
        time_signature: '',
        notes: []
    }

    switch (difficulty) {
        case 1:
            exercise.notes[0] = ({ keys: [`${rootNote}/4`], duration: 'q' })

            for (let i = 1; i < noteNumber; i++) {
                const note = getTonalNote([0, 2, 4], [4], i, noteNumber - 1)
                const duration = 'q'
                exercise.notes.push({ keys: [note], duration: duration })
            }
            break
        case 2:
            for (let i = 0; i < noteNumber; i++) {
                const note = getTonalNote([0, 2, 4, 5], [4], i, noteNumber - 1)
                const duration = 'q'
                exercise.notes.push({ keys: [note], duration: duration })
            }

            break
        case 3:

            break
        default:
            return null
    }

    exercise.time_signature = `${exercise.notes.length}/4`

    return exercise
}

const generateExercises = (number, type, difficulty, noteNumber) => {
    const exercises = {}

    for (let i = 1; i <= number; i++) {
        const index = currentIndex.toString().padStart(5, '0')
        currentIndex++

        let exercise = ''

        switch (type) {
            case 'tonal':
                exercise = generateTonalExercise(difficulty, noteNumber)
                break
            case 'atonal':
                exercise = generateRandomExercise()
                break
            default:
                return null
        }
        
        exercises[index] ={
            clef: exercise.clef,
            time_signature: exercise.time_signature,
            notes: exercise.notes
        }
    }

    return exercises
}

// const exercises = generateExercises()
// const json = JSON.stringify(exercises, null, 2)

let currentIndex = 1
const superEasyExercises = generateExercises(4, 'tonal', 1, 3)
console.log("super easy:", superEasyExercises)
const easyExercises = generateExercises(10, 'tonal', 2, 3)
console.log("easy:", easyExercises)

const allExercises = {
    ...superEasyExercises,
    ...easyExercises
}
console.log('all', allExercises)

const json = JSON.stringify(allExercises, null, 2)

const path = './src/exercises/generatedExercises.json'
fs.writeFile(path, json, 'utf8', (err) => {
    if (err) {
        console.error('An error occurred while writing JSON to file')
    } else {
        console.log('JSON file has been saved')
    }
})