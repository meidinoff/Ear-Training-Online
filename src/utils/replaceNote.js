import { formatNotes, drawVoices } from './noteDrawHelper'
import Vex from 'vexflow'

const { StaveNote } = Vex.Flow

const replaceBackground = (context, note, stave) => {
    //const boundingBox = note.getBoundingBox()

    const noteX = note.getAbsoluteX()

    const staveTop = stave.getY()
    const staveHeight = stave.getBottomY() - staveTop

    // console.log(boundingBox.x, noteX)
    // console.log(boundingBox.y, staveTop)
    // console.log(boundingBox.w)
    // console.log(boundingBox.h)

    context.save()

    context.fillStyle = 'RGBA(48, 167, 234, 0.3)'
    context.fillRect(noteX + 50, staveTop, 50 + 10, staveHeight)
    //context.fillRect(boundingBox.x, staveTop, boundingBox.w, boundingBox.h)

    context.restore()
}

export const replaceNote = (context, stave, notes) => {
    // choose which note to replace
    const replaceIndex = 1

    // replace note with 1/4 note B
    notes[replaceIndex] = new StaveNote({keys: ["c/7"], duration: 'q'})

    // create Voice and add ticks to all notes, then format everything
    const voices = formatNotes(notes)

    // create background overlay behind replaced note
    const newNote = notes[replaceIndex]
    replaceBackground(context, newNote, stave)

    // make replaced note invisible
    newNote.setStyle({ fillStyle: 'none', strokeStyle: 'none' })
    newNote.setLedgerLineStyle({ strokeStyle: 'none' })

    // redraw notes
    const newNotes = drawVoices(voices, context, stave)

    return newNotes
}