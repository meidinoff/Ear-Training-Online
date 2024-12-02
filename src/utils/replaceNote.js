import { formatNotes, drawVoices } from './noteDrawHelper'

import Vex from 'vexflow'

const { StaveNote } = Vex.Flow

const replaceBackground = (context, note, stave) => {
    // Calculate x position after time signature
    const timeSignature = stave.getModifiers()[4]
    const timeSignatureX = timeSignature['x'] + timeSignature['width']

    const staveTop = stave.getY()
    const staveHeight = stave.getBottomY() - staveTop

    // Create colored background for the user input area (where the note is missing)
    context.save()

    context.fillStyle = 'RGBA(48, 167, 234, 0.3)'
    context.fillRect(timeSignatureX + 97, staveTop, 50 + 10, staveHeight)
    // Above values probably only work for 3 note exercises
    // I couldn't get the commented out code below to work

    //context.fillRect(noteX + 50, staveTop, 50 + 10, staveHeight)
    //context.fillRect(boundingBox.x, staveTop, boundingBox.w, boundingBox.h)

    context.restore()
}

export const replaceNote = (context, stave, notes) => {
    // Choose which note to replace
    const replaceIndex = 1

    // Replace note with 1/4 note high C
    notes[replaceIndex] = new StaveNote({keys: ["c/7"], duration: 'q'})

    // Create Voice and add ticks to all notes, then format everything
    const voices = formatNotes(notes)

    // Create background overlay behind replaced note
    const newNote = notes[replaceIndex]
    replaceBackground(context, newNote, stave)

    // Make replaced note invisible
    newNote.setStyle({ fillStyle: 'none', strokeStyle: 'none' })
    newNote.setLedgerLineStyle({ strokeStyle: 'none' })

    // Redraw notes
    const newNotes = drawVoices(voices, context, stave)

    return newNotes
}