import { replaceNote } from './replaceNote'
import { formatNotes, drawVoices } from './noteDrawHelper'
import { calculatePitchClassDifference, findByInterval, calculateInterval } from '../music_knowledge/intervals'
import Vex from 'vexflow'

const { Stave, StaveNote, Accidental } = Vex.Flow

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

const constructExercise = ({ clef, time_signature, notes }, context) => {
    const stave = new Stave(0, 0, 400)
    stave.addClef(clef).addTimeSignature(time_signature)
    stave.setContext(context).draw()

    const staveNotes = constructStaveNotes(notes)

    return {
        stave,
        notes: staveNotes
    }
}

export const constructStaveNotes = (notes) => {
    const staveNotes = notes.map(note => {
        const staveNote = new StaveNote({ keys: note.keys, duration: note.duration })

        const regex = /(#|(?<=[a-g])b)\1*/g
        
        note.keys.forEach(key => {
            const matches = key.match(regex)
            if (matches) {
                staveNote.addModifier(new Accidental(matches))
            }
        })
        
        return staveNote
    })

    return staveNotes
}

export const constructAnswer = (exercise, context) => { 
    const { stave, notes } = constructExercise(exercise, context)

    const voices = formatNotes(notes, context, stave)
    const newNotes = drawVoices(voices, context, stave)

    context.clear()

    return {
        stave,
        notes: newNotes
    }
}

export const constructInput = (exercise, context) => {
    const { stave, notes } = constructExercise(exercise, context)

    const newNotes = replaceNote(context, stave, notes)

    return {
        stave,
        newNotes
    }
}