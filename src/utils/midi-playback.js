import Soundfont from 'soundfont-player'

// Relative pitch classes of note names
const noteMap = {
    'Cbb': -2,
    'Cb': -1,
    'C': 0,
    'C#': 1,
    'C##': 2,
    'Dbb': 0,
    'Db': 1,
    'D': 2,
    'D#': 3,
    'D##': 4,
    'Ebb': 2,
    'Eb': 3,
    'E': 4,
    'E#': 5,
    'E##': 6,
    'Fbb': 3,
    'Fb': 4,
    'F': 5,
    'F#': 6,
    'F##': 7,
    'Gbb': 5,
    'Gb': 6,
    'G': 7,
    'G#': 8,
    'G##': 9,
    'Abb': 7,
    'Ab': 8,
    'A': 9,
    'A#': 10,
    'A##': 11,
    'Bbb': 9,
    'Bb': 10,
    'B': 11,
    'B#': 12,
    'B##': 13
};

const getPitchClass = (note) => {
    const baseNote = note[0].toUpperCase()
    let accidental = note.slice(1)

    let fullNote = baseNote + accidental

    return noteMap[fullNote]
}

const noteToMidi = (note) => {
    // Split VexFlow 'key' into note name and octave number
    const noteParts = note.split('/')
    const letter = noteParts[0]
    const octave = Number(noteParts[1])

    const splitLetter = letter.split('') // Separate letter from accidental

    let newLetter = ''

    // Ignore natural accidental for midi calculation
    if (splitLetter.length > 1 && splitLetter[1] === 'n') {
        splitLetter.splice(1, splitLetter.length - 1)
        newLetter = splitLetter.join('')
    } else if (letter.length <= 1) {
        newLetter = letter
    } else {
        newLetter = splitLetter.join('')
    }


    const pitchClass = getPitchClass(newLetter)

    // Convert note name to midi note number
    const midiNumber = (octave + 1) * 12 + pitchClass

    return midiNumber
}

// Generates JSON for MIDI playback
export const createMidi = (data) => {
    const bpm = 100
    const timeSignature = data.time_signature.split('/')
    const notes = data.notes

    const midiData = {
        header: {
            PPQ: 480,
            bpm: bpm,
            timeSignature: [timeSignature[0], timeSignature[1]]
        },
        tracks: [
            {
                name: "Track 1",
                instrument: "acoustic grand piano",
                channel: 0,
                events: [
                    {
                        type: "programChange",
                        deltaTime: 0,
                        channel: 0,
                        programNumber: 0
                    },
                    ...notes.reduce((events, note) => {
                        const noteNumber = noteToMidi(note.keys[0])

                        events.push(
                            {
                                type: "noteOn",
                                deltaTime: 0,
                                channel: 0,
                                noteNumber: noteNumber,
                                velocity: 80
                            },
                            {
                                type: "noteOff",
                                deltaTime: 480,
                                channel: 0,
                                noteNumber: noteNumber,
                                velocity: 80
                            }
                        )

                        return events
                    }, [])
                ]
            }
        ]
    }


    return midiData
}

// Plays audio in window
export const playMidi = async (midiData, onStart, onStop) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    let player = await Soundfont.instrument(audioContext, 'acoustic_grand_piano') // Get piano playback sound    
    
    // Read data from MIDI JSON for playback
    const startTime = audioContext.currentTime
    const tempo = midiData.header.bpm
    const secondsPerBeat = 60 / tempo
    const ticksPerBeat = midiData.header.PPQ

    if (onStart) onStart()

    let totalDuration = 0

    // Dynamically plays each note in JSON
    midiData.tracks.forEach(track => {
        let currentTime = startTime

        track.events.forEach(event => {
            const eventTime = (event.deltaTime / ticksPerBeat) * secondsPerBeat
            currentTime += eventTime

            if (event.type === "noteOn" && event.velocity > 0) {
                playNote(player, event.noteNumber, event.velocity, currentTime, audioContext)
            }

            // Calculate duration of MIDI playback (in milliseconds)
            totalDuration = Math.max(totalDuration, currentTime - startTime)
        })
    })

    // Stop playback after track is finished
    setTimeout(() => {
        if (onStop) onStop()
    }, totalDuration * 1000)
}

const playNote = (player, noteNumber, velocity, startTime, audioContext) => {
    const duration = 0.65
    player.play(noteNumber, audioContext.currentTime + (startTime - audioContext. currentTime), { gain: velocity / 127, duration })
}