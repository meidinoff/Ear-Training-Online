import Vex from 'vexflow'
import exampleExercise from '../exercises/example_exercise'

const { Formatter } = Vex.Flow

const chooseExercise = (context) => {
    const { stave, clef, time_signature, voices } = exampleExercise()

    stave.addClef(clef).addTimeSignature(time_signature)
    stave.setContext(context).draw()
            
    new Formatter().joinVoices(voices).format(voices, 350)
        
    voices.forEach(voice => {
        voice.draw(context, stave)
    })
}

export default chooseExercise