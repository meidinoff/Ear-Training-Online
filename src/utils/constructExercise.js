import { replaceNote } from './replaceNote'
import { formatNotes, drawVoices } from './noteDrawHelper'
import Vex from 'vexflow'

const { Stave, StaveNote, Accidental } = Vex.Flow

const construct = ({ clef, timeSignature, notes }, context) => {
    const stave = new Stave(0, 0, 400)
    stave.addClef(clef).addTimeSignature(timeSignature)
    stave.setContext(context).draw()

    const staveNotes = notes.map(note => {
        const staveNote = new StaveNote({ keys: note.keys, duration: note.duration })

        const regex = /([#b])\1*/g
        
        note.keys.forEach(key => {
            const matches = key.match(regex)
            console.log("regex matches: ", matches)
            if (matches) {
                staveNote.addModifier(new Accidental(matches))
            }
        })
        
        return staveNote
    })

    return {
        stave,
        notes: staveNotes
    }
}

export const constructAnswer = (exercise, context) => { 
    const { stave, notes } = construct(exercise, context)

    const voices = formatNotes(notes, context, stave)
    const newNotes = drawVoices(voices, context, stave)

    context.clear()

    return {
        stave,
        notes: newNotes
    }
}

export const constructQuestion = (exercise, context) => {
    const { stave, notes } = construct(exercise, context)

    const newNotes = replaceNote(context, stave, notes)

    return {
        stave,
        newNotes
    }
}