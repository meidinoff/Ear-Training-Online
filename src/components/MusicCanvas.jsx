import { useRef, useEffect, useState } from 'react'
import BottomButtons from './BottomButtons'
import { createRenderer, renderExercise } from '../utils/renderCanvas'
import { drawHoverNote } from '../utils/hoverEffect'
import { calculatePitch, drawNotes } from '../utils/noteDrawHelper'
import { createMidi } from '../utils/midi-playback'

import Vex from 'vexflow'

const { Renderer, StaveNote, Accidental } = Vex.Flow

const MusicCanvas = ({ isAnswered, setIsAnswered, inputAccidental, resetAccidental, redrawNote, setRedraw, setBackgroundColor, isCorrect, setIsCorrect, isAddingXP }) => {
    const canvasRef = useRef(null)
    const hoverCanvasRef = useRef(null)
    const rendererRef = useRef(null)
    const hoverRendererRef = useRef(null)
    const hoverContext = useRef(null)

    const [context, setContext] = useState(null)
    const [notes, setNotes] = useState(null)
    const [answerNotes, setAnswerNotes] = useState(null)
    const [inputNotes, setInputNotes] = useState(null)
    const [stave, setStave] = useState(null)
    const [hoverNotePitch, setHoverNotePitch] = useState(null)
    const [questionMidi, setQuestionMidi] = useState('')
    const [answerMidi, setAnswerMidi] = useState('')
    const [pitchPosition, setPitchPosition] = useState('')
    const [noteInputTrigger, setNoteInputTrigger] = useState(false)
    const [exercise, setExercise] = useState('')
    const [keySignature, setKeySignature] = useState('')

    useEffect(() => {
        // Create VexFlow renderer at start and first exercise
        if (canvasRef.current) {
            if (!rendererRef.current) {
                rendererRef.current = createRenderer(canvasRef.current)
            }

            createExercise()
        }

        return () => {
            if (rendererRef.current) {
                rendererRef.current.getContext().clear()
            }
        }
    }, [])

    const createExercise = () => {
        // Choose exercise and set states
        const { stave, newNotes, context, midiData, answerNotes, exerciseData, keySignature } = renderExercise(rendererRef.current)
        setContext(context)

        setStave(stave)
        setNotes(newNotes)
        setQuestionMidi(midiData)
        setAnswerNotes(answerNotes)
        setExercise(exerciseData)
        setKeySignature(keySignature)
    }

    useEffect(() => {
        // Re-render the mouse hover overlay every time the mouse moves on the canvas
        if (hoverCanvasRef.current && !hoverRendererRef.current) {
            hoverRendererRef.current = new Renderer(hoverCanvasRef.current, Renderer.Backends.SVG)
            hoverContext.current = hoverRendererRef.current.getContext()
            hoverRendererRef.current.resize(420, 120)
        }

        if (notes && hoverContext.current && stave) {
            drawHoverNote(hoverContext.current, hoverNotePitch, notes[1].getAbsoluteX(), stave, exercise, keySignature)
        }
    }, [hoverNotePitch, notes, stave])

    useEffect(() => {
        // Re-calculate the pitch of the mouse position every time the mouse moves on the canvas
        if (pitchPosition) {
            drawInputNote(pitchPosition)
        }
    }, [pitchPosition, noteInputTrigger])

    useEffect(() => {
        // Only draw the note when the mouse position changes
        if (redrawNote && pitchPosition) {
            drawInputNote(pitchPosition)
            setRedraw(false)
        }
    }, [redrawNote])

    const getMousePitchPos = (event) => {
        // Get mouse coordinate position on canvas
        const svg = canvasRef.current.querySelector('svg')
        const pt = svg.createSVGPoint()
        pt.x = event.clientX
        pt.y = event.clientY
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())

        // Return the note name the mouse y position correlates to
        return calculatePitch(svgP.y, stave)
    }

    const handleMouseMove = (event) => {
        const newHoverNotePitch = getMousePitchPos(event)

        setHoverNotePitch(newHoverNotePitch)
    }

    const drawInputNote = () => {
        // Set accidental from buttons
        let accidental = ''

        switch (inputAccidental) {
            case 'double sharp':
                accidental = "##"
                break
            case 'sharp':
                accidental = '#'
                break
            case 'natural':
                accidental = 'n'
                break
            case 'flat':
                accidental = 'b'
                break
            case 'double flat':
                accidental = 'bb'
                break
            default:
                accidental = ''
        }


        const newPitch = pitchPosition
        const pitchArray = newPitch.split('/')

        // Check if there is already an accidental in StaveNote key, then replace with new accidental
        const letterName = pitchArray[0].split('')
        if (letterName.length > 1 && accidental) {
            letterName.splice(1, letterName.length - 1, accidental)
   
            const joinedLetterName = letterName.join('')

            pitchArray.splice(0, 1, joinedLetterName, '/')

        } else {
            pitchArray.splice(1, 0, accidental, '/')
        }

        const finalPitch = pitchArray.join('')

        // Render notes with accidentals chosen from user buttons
        const updatedNotes = notes.map((note, index) => {
            if (index === 1) {
                if (accidental) {
                    return new StaveNote({ keys: [finalPitch], duration: 'q', clef: stave.clef }).addModifier(new Accidental(accidental))
                } else {
                    return new StaveNote({ keys: [finalPitch], duration: 'q', clef: stave.clef })
                }
            }
            return note
        })

        const newDrawnNotes = drawNotes(updatedNotes, context, stave)

        setNotes(newDrawnNotes)
        setInputNotes(newDrawnNotes)

        // Create MIDI data from user input
        const midiData = createMidi({
            "clef": "treble",
            "time_signature": "3/4",
            "notes": newDrawnNotes.reduce((notes, note) => {
                notes.push({
                    "keys": note.keys,
                    "duration": note.duration
                })

                return notes
            }, [])
        })

        setAnswerMidi(midiData)
        setIsAnswered(true)
        resetAccidental('')
    }

    const handleClick = (event) => {
        const pitch = getMousePitchPos(event)

        setPitchPosition(pitch)

        setNoteInputTrigger(prev => !prev)
    }

    return (
        <div style={{ position: 'relative' }}>
            <div onMouseMove={handleMouseMove} style={{ position: 'relative', margin: '20px auto', height: '130px' }}>
                <div ref={canvasRef} onClick={handleClick} style={{ border: '2px solid black', backgroundColor: 'white', position: 'absolute', top: '0', left: '0', right: '0', zIndex: 1 }}></div>
                <div ref={hoverCanvasRef} style={{ position: 'absolute', top: 0, left: 0, right: '0', zIndex: 2, pointerEvents: 'none' }}></div>
            </div>
            <BottomButtons isAnswered={isAnswered} setIsAnswered={setIsAnswered} questionMidi={questionMidi} answerMidi={answerMidi} answerNotes={answerNotes} inputNotes={inputNotes} setBackgroundColor={setBackgroundColor} createExercise={createExercise} isCorrect={isCorrect} setIsCorrect={setIsCorrect} isAddingXP={isAddingXP} />
        </div>
    )
}

export default MusicCanvas