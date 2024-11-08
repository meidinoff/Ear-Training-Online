import exercises from '../exercises/exercises.json'
import { constructAnswer, constructInput } from './constructExercise'
import { createMidi } from './midi-playback'

const chooseExercise = (context) => {
    const exercise = exercises[Object.keys(exercises)[Math.floor(Math.random()*14)]] // NEED TO AUTOMATE THIS NUMBER TO NUMBER OF EXERCISES IN JSON
    console.log("exercise", exercise)

    const midiData = createMidi(exercise)

    const answer = constructAnswer(exercise, context)
    const input = constructInput(exercise, context)
    
    const stave = input.stave
    const newNotes = input.newNotes
    const answerNotes = answer.notes

    return { stave, newNotes, midiData, answerNotes, exerciseData: exercise }
}

export default chooseExercise