import Vex from 'vexflow'

const { StaveNote, Formatter, Voice } = Vex.Flow

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

export const replaceNote = (context, exercise) => {
    const { stave, notes } = exercise

    // choose which note to replace
    const replaceIndex = 1

    // replace note with 1/4 note B
    notes[replaceIndex] = new StaveNote({keys: ["b/4"], duration: 'q'})

    // create Voice and add ticks to all notes, then format everything
    const voices = [
        new Voice({ num_beats: 3, beat_value: 4 }).addTickables(notes)
    ]

    new Formatter().joinVoices(voices).format(voices, 350)

    // create background overlay behind replaced note
    const newNote = notes[replaceIndex]
    replaceBackground(context, newNote, stave)

    // make replaced note invisible
    newNote.setStyle({ fillStyle: 'none', strokeStyle: 'none' })

    // redraw notes
    voices.forEach(voice => {
        voice.draw(context, stave)
    })
}