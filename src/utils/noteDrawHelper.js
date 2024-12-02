import { calculateKeySignature } from './constructExercise'

import Vex from 'vexflow'

const { Voice, Formatter, Beam } = Vex.Flow

// Find note name from mouse y position
export const calculatePitch = (mouseY, stave) => {
    const pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const clef = stave.getClef()

    const keySigNotes = calculateKeySignature(stave)
    
    // Honestly not sure why these specific values work
    // I adjusted visually through trial and error
    const staveY = stave.getYForLine(5)
    const noteHeight = (stave.getYForLine(4) - stave.getYForLine(0)) / 4 / 2


    let noteIndex, octaveDisplacement
    const pitchIndex = Math.round((staveY - mouseY) / noteHeight)

    // Displace note y position based on rendered clef
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
    // Determine letter name from vertical position on staff
    const letterName = pitches[noteIndex]

    // Make sure accidental in note data reflects key signature
    // and doesn't require a notated accidental
    let note = ''

    if (keySigNotes.includes(`${letterName.toUpperCase()}#`)) {
        note = `${letterName}#`
    } else if (keySigNotes.includes(`${letterName.toUpperCase()}b`)) {
        note = `${letterName}b`
    } else {
        note = letterName
    }

    // Reconstruct VexFlow 'key' syntax
    const octave = Math.floor(pitchIndex / pitches.length)
    const adjustedOctave = octave + 4 + octaveDisplacement

    const key = `${note}/${adjustedOctave}`

    return key    
}

// Activates VexFlow's automatic formatting
export const formatNotes = (notes) => {
    const voices = [
        new Voice({ num_beats: notes.length, beat_value: 4 }).addTickables(notes)
    ]

    new Formatter().joinVoices(voices).format(voices, 350)

    return voices
}

// Similar function as formatNotes()
// Separated because of differences in answer key and visual input
export const drawVoices = (voices, context, stave) => {
    const notes = voices.map(voice => {
        return voice.getTickables()
    }).flat()

    Beam.generateBeams(notes) // Fixes stem direction automatically
    
    voices.forEach(voice => {
        voice.draw(context, stave)
    })

    return notes
}

export const drawNotes = (notes, context, stave) => {
    // Clear and redraw render
    context.clear()
    stave.setContext(context).draw()

    const voices = formatNotes(notes)
    // Return VexFlow note renders rather than note data
    const newNotes = drawVoices(voices, context, stave)

    return newNotes
}