import { useRef, useEffect, useState } from 'react'
import { createRenderer, renderExercise } from '../utils/renderCanvas'
import { drawHoverNote } from '../utils/hoverEffect'
import { calculatePitch, drawNotes } from '../utils/noteDrawHelper'
import Vex from 'vexflow'

const { Renderer, StaveNote } = Vex.Flow

const MusicCanvas = (props) => {
    const canvasRef = useRef(null)
    const hoverCanvasRef = useRef(null)
    const rendererRef = useRef(null)
    const hoverRendererRef = useRef(null)
    const hoverContext = useRef(null)

    const [context, setContext] = useState(null)
    const [notes, setNotes] = useState(null)
    const [stave, setStave] = useState(null)
    const [hoverNotePitch, setHoverNotePitch] = useState(null)

    useEffect(() => {
        if (canvasRef.current) {
            if (!rendererRef.current) {
                rendererRef.current = createRenderer(canvasRef.current)
            }

            const { stave, newNotes, context } = renderExercise(rendererRef.current)
            setContext(context)
            setStave(stave)
            setNotes(newNotes)
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

    const handleClick = (event) => {
        const newPitch = getMousePitchPos(event)
        const updatedNotes = notes.map((note, index) => {
            if (index === 1) {
                return new StaveNote({ keys: [newPitch], duration: 'q' })
            }
            return note
        })

        const newDrawnNotes = drawNotes(updatedNotes, context, stave)

        setNotes(newDrawnNotes)
        console.log("notes: ", notes)
        console.log("stem direction: ", notes[1].stem.stem_direction)
    }

    return (
        <div onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
            <div ref={canvasRef} onClick={handleClick} style={{ border: 'solid black', position: 'relative', zIndex: 1 }}></div>
            <div ref={hoverCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}></div>
            {props.children}
        </div>
    )
}

export default MusicCanvas