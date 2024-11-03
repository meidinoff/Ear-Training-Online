import { useRef, useEffect, useState } from 'react'
import BottomButtons from './BottomButtons'
import { createRenderer, renderExercise } from '../utils/renderCanvas'
import { drawHoverNote } from '../utils/hoverEffect'
import { calculatePitch, drawNotes } from '../utils/noteDrawHelper'
import { createMidi } from '../utils/midi-playback'
import Vex from 'vexflow'

const { Renderer, StaveNote, Accidental } = Vex.Flow

const MusicCanvas = ({ answered, setAnswered, inputAccidental, resetAccidental, redrawNote, setRedraw, setBackgroundColor }) => {
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

    useEffect(() => {
        if (canvasRef.current) {
            if (!rendererRef.current) {
                rendererRef.current = createRenderer(canvasRef.current)
            }

            const { stave, newNotes, context, midiData, answerNotes } = renderExercise(rendererRef.current)
            setContext(context)
            setStave(stave)
            setNotes(newNotes)
            setQuestionMidi(midiData)
            setAnswerNotes(answerNotes)
        }

        return () => {
            if (rendererRef.current) {
                rendererRef.current.getContext().clear()
            }
        }
    }, [])

    useEffect(() => {
        if (hoverCanvasRef.current && !hoverRendererRef.current) {
            hoverRendererRef.current = new Renderer(hoverCanvasRef.current, Renderer.Backends.SVG)
            hoverContext.current = hoverRendererRef.current.getContext()
            hoverRendererRef.current.resize(420, 120)
        }

        if (notes && hoverContext.current && stave) {
            drawHoverNote(hoverContext.current, hoverNotePitch, notes[1].getAbsoluteX(), stave)
        }
    }, [hoverNotePitch, notes, stave])

    useEffect(() => {
        if (pitchPosition) {
            drawInputNote(pitchPosition)
        }
    }, [pitchPosition])

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

        console.log('new accidental:', accidental)

        const newPitch = pitchPosition
        let pitchArray = newPitch.split('/')
        console.log("split", pitchArray)
        pitchArray.splice(1, 0, accidental, '/')
        console.log("splice:", pitchArray)
        const finalPitch = pitchArray.join('')
        console.log("newPitch: ", finalPitch)

        const updatedNotes = notes.map((note, index) => {
            if (index === 1) {
                if (accidental) {
                    return new StaveNote({ keys: [finalPitch], duration: 'q' }).addModifier(new Accidental(accidental))
                } else {
                    return new StaveNote({ keys: [finalPitch], duration: 'q' })
                }
            }
            return note
        })

        const newDrawnNotes = drawNotes(updatedNotes, context, stave)

        setNotes(newDrawnNotes)
        setInputNotes(newDrawnNotes)
        console.log("NOTES: ", notes)
        console.log("newDrawnNotes", newDrawnNotes)
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
        console.log("answer midi data:", midiData)
        setAnswerMidi(midiData)
        setAnswered(true)
        resetAccidental('')
        console.log('answered: ', answered)
    }

    const handleClick = (event) => {
        const pitch = getMousePitchPos(event)
        console.log(pitch)
        setPitchPosition(pitch)
        console.log("pitchPosition", pitchPosition)
        //drawInputNote(pitchPosition)
    }

    return (
        <div onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
            <div ref={canvasRef} onClick={handleClick} style={{ border: 'solid black', backgroundColor: 'white', position: 'relative', zIndex: 1 }}></div>
            <div ref={hoverCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}></div>
            <BottomButtons answered={answered} questionMidi={questionMidi} answerMidi={answerMidi} answerNotes={answerNotes} inputNotes={inputNotes} setBackgroundColor={setBackgroundColor} />
        </div>
    )
}

export default MusicCanvas