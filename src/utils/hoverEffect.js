import Vex from 'vexflow'

const { Stave, StaveNote } = Vex.Flow

export const drawHoverNote = (context, hoverNotePitch, questionNoteX, exerciseStave) => {
    context.clear()

    if (hoverNotePitch) {
        const noteX = questionNoteX - 16

        const hoverStave = new Stave(exerciseStave.x, exerciseStave.y + 2, exerciseStave.width)
        hoverStave.setStyle({ strokeStyle: 'none' })
        hoverStave.setContext(context).draw()

        const note = new StaveNote({ keys: [hoverNotePitch], duration: 'q' })
        note.setStyle({ fillStyle: 'rgba(0, 0, 0, 0.1)', strokeStyle: 'none' })
        
        note.setContext(context).setStave(hoverStave)
    
        const tickContent = new Vex.Flow.TickContext().setX(noteX)
        note.setTickContext(tickContent)

        note.draw()
    }
}