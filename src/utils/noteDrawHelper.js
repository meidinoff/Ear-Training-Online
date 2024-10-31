import Vex from 'vexflow'

const { Voice, Formatter, Stem } = Vex.Flow

export const calculatePitch = (mouseY, stave) => {
    const pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const staveY = stave.getYForLine(5)
    const noteHeight = (stave.getYForLine(4) - stave.getYForLine(0)) / 4 / 2

    //console.log((staveY - y) / noteHeight)

    const pitchIndex = Math.round((staveY - mouseY) / noteHeight)
    const noteIndex = ((pitchIndex % pitches.length) + pitches.length) % pitches.length

    const octave = Math.floor(pitchIndex / pitches.length)
    const adjustedOctave = octave + 4

    const key = `${pitches[noteIndex]}/${adjustedOctave}`
    //console.log("new note: ", key)
    return key    
}

const calculateStemDirection = (notes) => {
    let lineSum = 0;
    notes.forEach((note) => {
      if (note.keyProps) {
        note.keyProps.forEach((keyProp) => {
          lineSum += keyProp.line - 3;
        });
      }
    });
  
    if (lineSum >= 0) {
      return Stem.DOWN;
    }
    return Stem.UP;
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

    notes.map(note => {
        const direction = calculateStemDirection([note])
        console.log("direction: ", direction)
        note.setStemDirection(direction)
    })
    
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