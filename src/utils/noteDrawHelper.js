import { calculateKeySignature } from './constructExercise'
import Vex from 'vexflow'

const { Voice, Formatter, Beam } = Vex.Flow

export const calculatePitch = (mouseY, stave) => {
    const pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const staveY = stave.getYForLine(5)
    const noteHeight = (stave.getYForLine(4) - stave.getYForLine(0)) / 4 / 2

    //console.log((staveY - y) / noteHeight)

    const keySigNotes = calculateKeySignature(stave)

    const pitchIndex = Math.round((staveY - mouseY) / noteHeight)
    const noteIndex = ((pitchIndex % pitches.length) + pitches.length) % pitches.length
    const letterName = pitches[noteIndex]
    let note = ''

    if (keySigNotes.includes(`${letterName.toUpperCase()}#`)) {
        note = `${letterName}#`
    } else if (keySigNotes.includes(`${letterName.toUpperCase()}b`)) {
        note = `${letterName}b`
    } else {
        note = letterName
    }

    // ALSO NATURALS DON'T REGISTER AS CORRECT IF INPUT AS ACCIDENTAL

    const octave = Math.floor(pitchIndex / pitches.length)
    const adjustedOctave = octave + 4

    const key = `${note}/${adjustedOctave}`
    //console.log("new note: ", key)
    return key    
}

export const formatNotes = (notes) => {
    const voices = [
        new Voice({ num_beats: notes.length, beat_value: 4 }).addTickables(notes)
    ]

    new Formatter().joinVoices(voices).format(voices, 350)

    return voices
}

export const drawVoices = (voices, context, stave) => {
    const notes = voices.map(voice => {
        return voice.getTickables()
    }).flat()

    Beam.generateBeams(notes)
    
    voices.forEach(voice => {
        voice.draw(context, stave)
    })

    return notes
}

export const drawNotes = (notes, context, stave) => {
    context.clear()
    stave.setContext(context).draw()

    const voices = formatNotes(notes)

    const newNotes = drawVoices(voices, context, stave)

    return newNotes
}