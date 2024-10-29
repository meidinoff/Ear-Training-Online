import exampleExercise from '../exercises/example_exercise'
import { replaceNote } from './replaceNote'

const chooseExercise = (context) => {
    const originalExample = exampleExercise()

    const stave = originalExample.stave
    const clef = originalExample.clef
    const time_signature = originalExample.time_signature

    stave.addClef(clef).addTimeSignature(time_signature)
    stave.setContext(context).draw()

    replaceNote(context, originalExample)
}

export default chooseExercise