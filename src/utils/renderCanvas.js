import Vex from 'vexflow'
import chooseExercise from './chooseExercise'

const { Renderer } = Vex.Flow

export const createRenderer = (canvas) => {
    return new Renderer(canvas, Renderer.Backends.SVG)
}

export const renderExercise = (renderer) => {
    const canvasWidth = 420
    const canvasHeight = 120
    renderer.resize(canvasWidth, canvasHeight)
    const context = renderer.getContext()
    context.clear()

    const { stave, newNotes, midiData } = chooseExercise(context)

    return { stave, newNotes, context, midiData }
}