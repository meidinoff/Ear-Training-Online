import Vex from 'vexflow'

const { Stave, StaveNote, Accidental } = Vex.Flow

const exampleExercise = () => {
    const stave = new Stave(0, 0, 400)
    const clef = "treble"
    const time_signature = "4/4"

    const notes = [
        new StaveNote({ keys: ["c#/4"], duration: 'q'}).addModifier(new Accidental("#")),
        new StaveNote({ keys: ["d/4", "e/4"], duration: 'q'}),
        new StaveNote({ keys: ["d/5"], duration: 'q'})
    ]

    return {
        stave,
        clef,
        time_signature,
        notes
    }
}

export default exampleExercise