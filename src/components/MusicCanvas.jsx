import { useRef, useEffect, useState } from 'react'
import BottomButtons from './BottomButtons'
import { createRenderer, renderExercise } from '../utils/renderCanvas'
import { drawHoverNote } from '../utils/hoverEffect'
import { calculatePitch, drawNotes } from '../utils/noteDrawHelper'
import { createMidi } from '../utils/midi-playback'
import Vex from 'vexflow'

const { Renderer, StaveNote, Accidental } = Vex.Flow

const MusicCanvas = ({ answered, setAnswered, inputAccidental, resetAccidental, redrawNote, setRedraw, setBackgroundColor, correct, setCorrect, addingXP }) => {
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
        if (pitchPosition) {
            drawInputNote(pitchPosition)
        }
    }, [pitchPosition, noteInputTrigger])

    useEffect(() => {
        if (redrawNote && pitchPosition) {
            drawInputNote(pitchPosition)
            setRedraw(false)
        }
    }, [redrawNote])

    const getMousePitchPos = (event) => {
        const svg = canvasRef.current.querySelector('svg')
        const pt = svg.createSVGPoint()
        pt.x = event.clientX
        pt.y = event.clientY
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())


        return calculatePitch(svgP.y, stave)
    }

    const handleMouseMove = (event) => {
        const newHoverNotePitch = getMousePitchPos(event)

        setHoverNotePitch(newHoverNotePitch)
    }

    const drawInputNote = () => {
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
        setAnswered(true)
        resetAccidental('')

    }

    const handleClick = (event) => {
        const pitch = getMousePitchPos(event)

        setPitchPosition(pitch)

        setNoteInputTrigger(prev => !prev)
        //drawInputNote(pitchPosition)
    }

    return (
        <div style={{ position: 'relative' }}>
            <div onMouseMove={handleMouseMove} style={{ position: 'relative', margin: '20px auto', height: '130px' }}>
                <div ref={canvasRef} onClick={handleClick} style={{ border: 'solid black', backgroundColor: 'white', position: 'absolute', top: '0', left: '0', right: '0', zIndex: 1 }}></div>
                <div ref={hoverCanvasRef} style={{ position: 'absolute', top: 0, left: 0, right: '0', zIndex: 2, pointerEvents: 'none' }}></div>
            </div>
            <BottomButtons answered={answered} setAnswered={setAnswered} questionMidi={questionMidi} answerMidi={answerMidi} answerNotes={answerNotes} inputNotes={inputNotes} setBackgroundColor={setBackgroundColor} createExercise={createExercise} correct={correct} setCorrect={setCorrect} addingXP={addingXP} />
        </div>
    )
}

export default MusicCanvas