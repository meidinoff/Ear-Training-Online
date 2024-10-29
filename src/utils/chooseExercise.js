import exercises from '../exercises/exercises.json'
import { constructAnswer, constructQuestion } from './constructExercise'

const chooseExercise = (context) => {
    const parsedObject = JSON.parse(JSON.stringify(exercises))
    const exercise = parsedObject["00001"]

    const answer = constructAnswer(exercise, context)
    const question = constructQuestion(exercise, context)
    
    const stave = question.stave
    const newNotes = question.newNotes

    return { stave, newNotes }
}

export default chooseExercise