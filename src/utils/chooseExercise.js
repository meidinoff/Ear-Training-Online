import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput } from './constructExercise'
import { createMidi } from './midi-playback'

const chooseExercise = (context) => {
    const parsedObject = JSON.parse(JSON.stringify(exercises))
    const exercise = parsedObject["00001"]
    console.log(exercise)

    const midiData = createMidi(exercise)

    const answer = constructAnswer(exercise, context)
    const input = constructInput(exercise, context)
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    return { stave, newNotes, midiData, answerNotes, exerciseData: exercise }
}

export default chooseExercise