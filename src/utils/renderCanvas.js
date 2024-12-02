import Vex from 'vexflow'

import { chooseExercise } from './chooseExercise'

const { Renderer } = Vex.Flow

// Create VexFlow Renderer once at start of app
export const createRenderer = (canvas) => {
    return new Renderer(canvas, Renderer.Backends.SVG)
}

// Clear and redraw render every time a new exercise is chosen
export const renderExercise = (renderer) => {
    const canvasWidth = 420
    const canvasHeight = 120
    renderer.resize(canvasWidth, canvasHeight)
    const context = renderer.getContext()
    context.clear()

    const { stave, newNotes, midiData, answerNotes, exerciseData, keySignature } = chooseExercise(context)

    return { stave, newNotes, context, midiData, answerNotes, exerciseData, keySignature }
}