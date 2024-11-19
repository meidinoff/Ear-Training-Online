const noteMap = {
    'C': { pitchClass: 0, letter: 'C' },
    'C#': { pitchClass: 1, letter: 'C' },
    'C##': { pitchClass: 2, letter: 'C' },
    'Dbb': { pitchClass: 0, letter: 'D' },
    'Db': { pitchClass: 1, letter: 'D' },
    'D': { pitchClass: 2, letter: 'D' },
    'D#': { pitchClass: 3, letter: 'D' },
    'D##': { pitchClass: 4, letter: 'D' },
    'Ebb': { pitchClass: 2, letter: 'E' },
    'Eb': { pitchClass: 3, letter: 'E' },
    'E': { pitchClass: 4, letter: 'E' },
    'E#': { pitchClass: 5, letter: 'E' },
    'E##': { pitchClass: 6, letter: 'E' },
    'Fbb': { pitchClass: 3, letter: 'F' },
    'Fb': { pitchClass: 4, letter: 'F' },
    'F': { pitchClass: 5, letter: 'F' },
    'F#': { pitchClass: 6, letter: 'F' },
    'F##': { pitchClass: 7, letter: 'F' },
    'Gbb': { pitchClass: 5, letter: 'G' },
    'Gb': { pitchClass: 6, letter: 'G' },
    'G': { pitchClass: 7, letter: 'G' },
    'G#': { pitchClass: 8, letter: 'G' },
    'G##': { pitchClass: 9, letter: 'G' },
    'Abb': { pitchClass: 7, letter: 'A' },
    'Ab': { pitchClass: 8, letter: 'A' },
    'A': { pitchClass: 9, letter: 'A' },
    'A#': { pitchClass: 10, letter: 'A' },
    'A##': { pitchClass: 11, letter: 'A' },
    'Bbb': { pitchClass: 9, letter: 'B' },
    'Bb': { pitchClass: 10, letter: 'B' },
    'B': { pitchClass: 11, letter: 'B' }
}

// pitch class distance from origin note
const intervals = {
    unison: 0,
    m2: 1,
    M2: 2,
    m3: 3,
    M3: 4,
    P4: 5,
    d5: 6,
    P5: 7,
    m6: 8,
    M6: 9,
    m7: 10,
    M7: 11,
    octave: 12,
    m9: 13,
    M9: 14
}

const findKeyByValue = (object, number) => {
    for (const [name, value] of Object.entries(object)) {
        if (value === number) {
            return name
        }
    }
}

const findEnharmonic = (targetLetter, targetPitchClass) => {
    for (const [note, { pitchClass, letter }] of Object.entries(noteMap)) {
        if (letter === targetLetter && pitchClass === targetPitchClass) {
            return note
        }
    }
    return null
}

export const calculatePitchClassDifference = (note1, note2) => {
    const note1Pitch = noteMap[note1]
    const note2Pitch = noteMap[note2]

    return (note2Pitch.pitchClass - note1Pitch.pitchClass) % 12
}

export const calculateInterval = (note1, note2) => {
    const noteParts = [note1, note2].map(note => {
        const noteParts = note.split('/')
        const letter = noteParts[0]
        const octave = Number(noteParts[1])

        return { letter, octave }
    })

    const note1Pitch = noteParts[0].letter
    const note2Pitch = noteParts[1].letter
    console.log("note input pitch classes: ", note1Pitch.pitchClass, note2Pitch.pitchClass)

    const difference = calculatePitchClassDifference(note2Pitch, note1Pitch)
    console.log("difference: ", difference)

    const intervalName = findKeyByValue(intervals, Math.abs(difference))

    if (difference < 0) {
        return `Down_${intervalName}`
    } else {
        return `Up_${intervalName}`
    }
}

export const findByInterval = (startingNote, interval) => {
    const noteParts = startingNote.split('/')
    const letter = (noteParts[0]).toUpperCase()
    const octave = Number(noteParts[1])

    const { pitchClass: note, letter: startLetter } = noteMap[letter]
    const intervalNumber = intervals[interval]
    console.log("intervalNumber", intervalNumber)

    const octaveDifference = Math.floor((note + intervalNumber) / 12)
    const newPitchClass = (note + intervalNumber) % 12
    console.log("newPitchClass", newPitchClass)

    const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const startLetterIndex = letters.indexOf(startLetter)
    const intervalSteps = [0, 2, 4, 5, 7, 9, 11, 12]
    const intervalIndex = intervalSteps.findIndex(steps => steps >= intervalNumber % 12)
    const targetLetterIndex = (startLetterIndex + intervalIndex) % 7
    const targetLetter = letters[targetLetterIndex]

    const newNoteName = findEnharmonic(targetLetter, newPitchClass)

    return `${newNoteName}/${octave + octaveDifference}`
}