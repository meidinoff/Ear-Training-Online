import Vex from 'vexflow'
import { constructStaveNotes } from './constructExercise'

const { Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow

export const drawHoverNote = (context, hoverNotePitch, questionNoteX, exerciseStave, exerciseData) => {
    context.clear()

    if (hoverNotePitch) {
        const noteX = questionNoteX //- 16

        const hoverStave = new Stave(exerciseStave.x, exerciseStave.y + 2, exerciseStave.width)
        hoverStave.setClef(exerciseData.clef).setTimeSignature(exerciseData.time_signature)
        hoverStave.setStyle({ strokeStyle: 'none' })
        const clefGlyph = hoverStave.getModifiers().find(modifier => modifier.attrs.type  === "Clef")
        clefGlyph.setStyle({ fillStyle: 'none' })
        const timeSigGlyph = hoverStave.getModifiers().find(modifier => modifier.attrs.type === "TimeSignature")
        timeSigGlyph.setStyle({ fillStyle: 'none' })
        hoverStave.setContext(context).draw()

        const notesList = constructStaveNotes(exerciseData.notes)

        const note = new StaveNote({ keys: [hoverNotePitch], duration: 'q' })
        note.setStyle({ fillStyle: 'rgba(0, 0, 0, 0.1)', strokeStyle: 'none' })

        notesList[1] = note

        //console.log(exerciseData.notes)
        // const notesList = exerciseData.notes.map(note => {
        //     return new StaveNote({ keys: [hoverNotePitch], duration: 'q' })
        // })
        // const notesList = [
        //     new StaveNote({ keys: ['c#/4'], duration: 'q' }).addModifier(new Accidental('#')),
        //     note,
        //     new StaveNote({ keys: ['d/5'], duration: 'q' }).setStyle({ fillStyle: 'none', strokeStyle: 'none' })
        // ]

        notesList[0].setStyle({ fillStyle: 'none', strokeStyle: 'none' }).setLedgerLineStyle({ strokeStyle: 'none' })
        
        //console.log(notesList)

        note.setContext(context).setStave(hoverStave)
        const voice = new Voice({ num_beats: 3, beat_value: 4 })
        voice.addTickables(notesList)
        new Formatter().joinVoices([voice]).format([voice], 350)
        voice.draw(context, exerciseStave)
    }
}