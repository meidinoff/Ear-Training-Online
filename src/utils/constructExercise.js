import { replaceNote } from './replaceNote'
import { formatNotes, drawVoices } from './noteDrawHelper'
import { findByInterval, calculateInterval } from '../music_knowledge/intervals'
import { keys } from '../music_knowledge/scales'

import Vex from 'vexflow'

const { Stave, StaveNote, Accidental, KeySignature } = Vex.Flow

export const transposeExercise = (exercise, keySignature) => {
    // Calculate distance between C major and chosen key
    const keyDistance = calculateInterval('C/4', `${keySignature}/4`)

    const transposedNotes = exercise.notes.map(note => {
        // Calculate note name based on calculated interval
        const newNote = [(findByInterval(note['keys'][0], keyDistance.split('_')[1])).toLowerCase()] // Convert to lowercase for consistency

        return {
            "duration": "q",
            "keys": newNote
        }
    })

    // Replace all notes in exercise with transposed versions
    exercise['notes'] = transposedNotes
    
    return exercise
}

// Finds notes in key signature from VexFlow stave
export const calculateKeySignature = (stave) => {
    const modifiers = stave.getModifiers()
    const keySignature = modifiers.find(modifier => modifier.getAttribute('type') === 'KeySignature')

    const keySigAccidentals = keySignature['accList']

    if (keySigAccidentals.length !== 0) { // If there is a key signature
        // Determine letter names from key signature attached to staff
        const keySigAccidentalType = keySigAccidentals[0]['type']
        const keySigAccidentalNumber = keySigAccidentals.length

        // References object mapping out major keys from circle of fifths
        const keySigNotes = keys[keySigAccidentalType][keySigAccidentalNumber]

        return keySigNotes
    } else {
        // C major
        return ''
    }
}

// Creates VexFlow rendering of exercise data
const constructExercise = ({ clef, time_signature, notes }, keySignature, context) => {
    const stave = new Stave(0, 0, 400).addModifier(new KeySignature(keySignature))
    stave.addClef(clef).addTimeSignature(time_signature)
    stave.setContext(context).draw()

    const staveNotes = constructStaveNotes(notes, clef, stave)

    return {
        stave,
        notes: staveNotes
    }
}

export const constructStaveNotes = (notes, clef, stave) => {
    const keySigNotes = calculateKeySignature(stave)

    // Creates VexFlow StaveNotes from note data
    const staveNotes = notes.map(note => {
        const staveNote = new StaveNote({ keys: note.keys, duration: note.duration, clef: clef })

        // Regex looks for accidentals in note name
        // Looks complex since 'b' can be a note letter or flat sign
        const regex = /(#|(?<=[a-g])b)\1*/g
        
        // Looks to see if each note has an accidental
        note.keys.forEach(key => {
            const matches = key.match(regex) // Does note contain accidental?

            const keyNote = key.split('/')[0] // Get note name without octave
            const noteParts = keyNote.split('') // Separate letter from accidental
            const noteLetter = noteParts[0].toUpperCase()

            let convertedNote = ''
            noteParts.length === 1 ? 
                convertedNote = noteLetter :
                convertedNote = noteLetter + noteParts[1]

            // Only renders accidental if it is not in the key signature
            if (matches && !keySigNotes.includes(convertedNote)) {
                staveNote.addModifier(new Accidental(matches))
            }
        })
        
        return staveNote
    })

    return staveNotes
}

// Answer key for comparison
export const constructAnswer = (exercise, keySignature, context) => { 
    const { stave, notes } = constructExercise(exercise, keySignature, context)

    // Activate VexFlow's automatic formatting tools
    const voices = formatNotes(notes)
    const newNotes = drawVoices(voices, context, stave)

    // Clear answer from user's screen
    context.clear()

    return {
        stave,
        notes: newNotes
    }
}

// Version the user sees
export const constructInput = (exercise, keySignature, context) => {
    const { stave, notes } = constructExercise(exercise, keySignature, context)

    // Replace 1 note with a blank space for the user to fill in
    const newNotes = replaceNote(context, stave, notes)

    return {
        stave,
        newNotes
    }
}