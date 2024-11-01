import Soundfont from 'soundfont-player'

const noteToMidi = (note) => {
    const noteMap = {
        'C': 0,
        'C#': 1,
        'Db': 1,
        'D': 2,
        'D#': 3,
        'Eb': 3,
        'E': 4,
        'F': 5,
        'F#': 6,
        'Gb': 6,
        'G': 7,
        'G#': 8,
        'Ab': 8,
        'A': 9,
        'A#': 10,
        'Bb': 10,
        'B': 11
    };

    const noteParts = note.split('/')
    console.log("noteParts", noteParts)
    const letter = noteParts[0]
    const octave = Number(noteParts[1])
    console.log(letter, octave)

    const pitchClass = noteMap[letter.toUpperCase()]
    console.log("pitchClass", pitchClass)

    const midiNumber = (octave + 1) * 12 + pitchClass
    console.log("1", (octave + 1))
    console.log("2", pitchClass)
    console.log("3", midiNumber)

    return midiNumber
}

export const createMidi = () => {
    const bpm = 100
    const timeSignature = ("3/4").split('/')
    const notes = [
        {
            "keys": ["c#/4"],
            "duration": "q"
        },
        {
            "keys": ["d/4"],
            "duration": "q"
        },
        {
            "keys": ["d/5"],
            "duration": "q"
        }
    ]

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

export const playMidi = async (midiData) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const player = await Soundfont.instrument(audioContext, 'acoustic_grand_piano')

    const startTime = audioContext.currentTime
    const tempo = midiData.header.bpm
    const secondsPerBeat = 60 / tempo
    const ticksPerBeat = midiData.header.PPQ

    midiData.tracks.forEach(track => {
        let currentTime = startTime

        track.events.forEach(event => {
            console.log("EVENT", event)
            const eventTime = (event.deltaTime / ticksPerBeat) * secondsPerBeat
            currentTime += eventTime

            if (event.type === "noteOn" && event.velocity > 0) {
                playNote(player, event.noteNumber, event.velocity, currentTime, audioContext)
            }
        })
    })
}

const playNote = (player, noteNumber, velocity, startTime, audioContext) => {
    const duration = 0.65
    player.play(noteNumber, audioContext.currentTime + (startTime - audioContext. currentTime), { gain: velocity / 127, duration })
}