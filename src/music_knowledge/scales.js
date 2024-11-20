// scales notated as pitch class relationships, not intervals
const majorScale = [0, 2, 4, 5, 7, 9, 11]
const naturalMinorScale = [0, 2, 3, 5, 7, 8, 10]
const harmonicMinorScale = [0, 2, 3, 5, 7, 8, 11]
const melodicMinorScale = [0, 2, 3, 5, 7, 9, 11]

export const scales = {
    majorScale,
    naturalMinorScale,
    harmonicMinorScale,
    melodicMinorScale
}

export const keys = {
    '#': {
        1: ['F#'],
        2: ['F#', 'C#'],
        3: ['F#', 'C#', 'G#'],
        4: ['F#', 'C#', 'G#', 'D#'],
        5: ['F#', 'C#', 'G#', 'D#', 'A#'],
        6: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'],
        7: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
    },
    'b': {
        1: ['Bb'],
        2: ['Bb', 'Eb'],
        3: ['Bb', 'Eb', 'Ab'],
        4: ['Bb', 'Eb', 'Ab', 'Db'],
        5: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
        6: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
        7: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
    }
}