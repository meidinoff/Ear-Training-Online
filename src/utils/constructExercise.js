import { replaceNote } from './replaceNote'
import { formatNotes, drawVoices } from './noteDrawHelper'
import { calculatePitchClassDifference, findByInterval, calculateInterval } from '../music_knowledge/intervals'
import { keys } from '../music_knowledge/scales'
import Vex from 'vexflow'

const { Stave, StaveNote, Accidental, KeySignature } = Vex.Flow

export const transposeExercise = (exercise, keySignature) => {
    // const keyDistance = calculatePitchClassDifference('C', `${keySignature}`)
    // console.log("key distance:", keyDistance)

    // const transposedNotes = exercise.notes.map(note => {

    // })

    const keyDistance = calculateInterval('C/4', `${keySignature}/4`)
    console.log("key distance:", keyDistance)

    const transposedNotes = exercise.notes.map(note => {
        console.log("note!!", note['keys'][0])
        const newNote = [(findByInterval(note['keys'][0], keyDistance.split('_')[1])).toLowerCase()]
        console.log("note:", newNote)

        return {
            "duration": "q",
            "keys": newNote
        }
    })

    exercise['notes'] = transposedNotes
    
    return exercise
}

const calculateKeySignature = (stave) => {
    const keySignature = stave.getModifiers()[2]
    const keySigAccidentals = keySignature['accList']

    if (keySigAccidentals.length !== 0) {
        const keySigAccidentalType = keySigAccidentals[0]['type']
        const keySigAccidentalNumber = keySigAccidentals.length
        const keySigNotes = keys[keySigAccidentalType][keySigAccidentalNumber]
        console.log("accidental number:", keySigAccidentalNumber)
        console.log("key match:", keySigNotes)

        return keySigNotes
    } else {
        return ''
    }
}

const constructExercise = ({ clef, time_signature, notes }, keySignature, context) => {
    const stave = new Stave(0, 0, 400).addModifier(new KeySignature(keySignature))
    stave.addClef(clef).addTimeSignature(time_signature)
    stave.setContext(context).draw()

    console.log(stave.getModifiers())

    const staveNotes = constructStaveNotes(notes, stave)

    return {
        stave,
        notes: staveNotes
    }
}

export const constructStaveNotes = (notes, stave) => {
    const keySigNotes = calculateKeySignature(stave)

    const staveNotes = notes.map(note => {
        const staveNote = new StaveNote({ keys: note.keys, duration: note.duration })

        const regex = /(#|(?<=[a-g])b)\1*/g
        
        note.keys.forEach(key => {
            const matches = key.match(regex)
            const keyNote = key.split('/')[0]
            const noteParts = keyNote.split('')
            const noteLetter = noteParts[0].toUpperCase()
            let convertedNote = ''
            noteParts.length === 1 ? 
                convertedNote = noteLetter :
                convertedNote = noteLetter + noteParts[1]

            console.log('key', convertedNote)
            if (matches && !keySigNotes.includes(convertedNote)) {
                staveNote.addModifier(new Accidental(matches))
            }
        })
        
        return staveNote
    })

    return staveNotes
}

export const constructAnswer = (exercise, keySignature, context) => { 
    const { stave, notes } = constructExercise(exercise, keySignature, context)

    const voices = formatNotes(notes, context, stave)
    const newNotes = drawVoices(voices, context, stave)

    context.clear()

    return {
        stave,
        notes: newNotes
    }
}

export const constructInput = (exercise, keySignature, context) => {
    const { stave, notes } = constructExercise(exercise, keySignature, context)

    const newNotes = replaceNote(context, stave, notes)

    return {
        stave,
        newNotes
    }
}