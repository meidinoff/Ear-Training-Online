import Vex from 'vexflow'

import { constructStaveNotes } from './constructExercise'

const { Stave, StaveNote, Voice, Formatter, KeySignature } = Vex.Flow

// Creates note overlay when user hovers mouse over staff
export const drawHoverNote = (context, hoverNotePitch, questionNoteX, exerciseStave, exerciseData, keySignature) => {
    context.clear() // Prevent accumulation

    if (hoverNotePitch) { // If mouse is over staff
        // Render an identical, completely transparent staff over the one the user sees
        const hoverStave = new Stave(exerciseStave.x, exerciseStave.y + 2, exerciseStave.width).addModifier(new KeySignature(keySignature))
        hoverStave.setClef(exerciseData.clef).setTimeSignature(exerciseData.time_signature)
        hoverStave.setStyle({ strokeStyle: 'none' })
        const clefGlyph = hoverStave.getModifiers().find(modifier => modifier.attrs.type  === "Clef")
        clefGlyph.setStyle({ fillStyle: 'none' })
        const timeSigGlyph = hoverStave.getModifiers().find(modifier => modifier.attrs.type === "TimeSignature")
        timeSigGlyph.setStyle({ fillStyle: 'none' })
        hoverStave.setContext(context).draw()

        const notesList = constructStaveNotes(exerciseData.notes, exerciseData.clef, hoverStave)

        // Draw overlay note
        const note = new StaveNote({ keys: [hoverNotePitch], duration: 'q', clef: exerciseData.clef })
        note.setStyle({ fillStyle: 'rgba(0, 0, 0, 0.1)', strokeStyle: 'none' })

        notesList[1] = note

        // Make other notes transparent (all notes must be rendered for automatic horizontal formatting)
        notesList[0].setStyle({ fillStyle: 'none', strokeStyle: 'none' }).setLedgerLineStyle({ strokeStyle: 'none' })
        notesList[2].setStyle({ fillStyle: 'none', strokeStyle: 'none' }).setLedgerLineStyle({ strokeStyle: 'none' })
        
        // Format invisible render so the overlay's x position is accurate
        note.setContext(context).setStave(hoverStave)
        const voice = new Voice({ num_beats: 3, beat_value: 4 })
        voice.addTickables(notesList)
        new Formatter().joinVoices([voice]).format([voice], 350)
        voice.draw(context, exerciseStave)
    }
}