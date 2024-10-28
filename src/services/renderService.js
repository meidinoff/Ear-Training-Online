import Vex from 'vexflow'
import chooseExercise from './chooseExercise'

const { Renderer } = Vex.Flow

export const createRenderer = (canvas) => {
    return new Renderer(canvas, Renderer.Backends.SVG)
}

export const renderExercise = (renderer) => {
    const canvasWidth = 500
    const canvasHeight = 200
    renderer.resize(canvasWidth, canvasHeight)
    const context = renderer.getContext()
    context.clear()

    chooseExercise(context)
}