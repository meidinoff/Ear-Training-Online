import exercises from '../exercises/exercises.json'
import { constructAnswer, constructQuestion } from './constructExercise'
import { createMidi } from './midi-playback'

const chooseExercise = (context) => {
    const parsedObject = JSON.parse(JSON.stringify(exercises))
    const exercise = parsedObject["00001"]
    console.log(exercise)

    const midiData = createMidi(exercise)

    const answer = constructAnswer(exercise, context)
    const question = constructQuestion(exercise, context)
    
    const stave = question.stave
    const newNotes = question.newNotes

    return { stave, newNotes, midiData }
}

export default chooseExercise