import { calculateKeySignature } from './constructExercise'
import Vex from 'vexflow'

const { Voice, Formatter, Beam } = Vex.Flow

export const calculatePitch = (mouseY, stave) => {
    const pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const clef = stave.getClef()
    console.log("clef:", clef)
    const keySigNotes = calculateKeySignature(stave)
    
    const staveY = stave.getYForLine(5)
    const noteHeight = (stave.getYForLine(4) - stave.getYForLine(0)) / 4 / 2

    //console.log((staveY - y) / noteHeight)

    // FIGURE OUT HOW TO CALCULATE IN OTHER CLEFS

    let noteIndex, octaveDisplacement
    const pitchIndex = Math.round((staveY - mouseY) / noteHeight)
    console.log("PITCH INDEX", pitchIndex, pitchIndex % pitches.length)
    // const noteIndex = ((pitchIndex % pitches.length) + pitches.length) % pitches.length
    switch (clef) {
        case 'bass':
            noteIndex = ((((pitchIndex + 2) % pitches.length) + pitches.length) % pitches.length)
            octaveDisplacement = -2

            if (noteIndex <= 1) {
                octaveDisplacement += 1
            }
            break
        case 'alto':
            noteIndex = ((((pitchIndex + 1) % pitches.length) + pitches.length) % pitches.length)
            octaveDisplacement = -1

            if (noteIndex === 0) {
                octaveDisplacement += 1
            }
            break
        case 'tenor':
            noteIndex = ((((pitchIndex - 1) % pitches.length) + pitches.length) % pitches.length)
            octaveDisplacement = -1

            if (noteIndex === 6) {
                octaveDisplacement -= 1
            }
            break
        default:
            noteIndex = ((pitchIndex % pitches.length) + pitches.length) % pitches.length
            octaveDisplacement = 0
    }
    const letterName = pitches[noteIndex]
    let note = ''

    if (keySigNotes.includes(`${letterName.toUpperCase()}#`)) {
        note = `${letterName}#`
    } else if (keySigNotes.includes(`${letterName.toUpperCase()}b`)) {
        note = `${letterName}b`
    } else {
        note = letterName
    }

    const octave = Math.floor(pitchIndex / pitches.length)
    const adjustedOctave = octave + 4 + octaveDisplacement

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

    console.log("VOICES:", voices)

    return notes
}

export const drawNotes = (notes, context, stave) => {
    context.clear()
    stave.setContext(context).draw()

    const voices = formatNotes(notes)

    const newNotes = drawVoices(voices, context, stave)

    return newNotes
}