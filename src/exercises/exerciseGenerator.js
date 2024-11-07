import fs from 'fs'

const noteMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

const getRandomNote = () => {
    const note = noteMap[Math.floor(Math.random() * noteMap.length)];
    const octave = Math.floor(Math.random() * 2) + 4; // Generate notes between octave 3 and 6
    return `${note}/${octave}`;
};

const generateRandomExercise = () => {
    const timeSignatures = ['4/4', '3/4', '2/4'];
    const randomTimeSignature = timeSignatures[Math.floor(Math.random() * timeSignatures.length)];

    const exercise = {
        clef: 'treble',
        time_signature: randomTimeSignature,
        notes: []
    };

    for (let i = 0; i < 3; i++) { // Generate 8 notes per exercise
        const note = getRandomNote();
        const duration = 'q'; // You can randomize durations as well if needed
        exercise.notes.push({ keys: [note], duration: duration });
    }

    return exercise;
};

const generateExercises = () => {
    const exercises = {}

    for (let i = 1; i <= 20; i++) {
        const index = i.toString().padStart(5, '0')
        const exercise = generateRandomExercise()
        exercises[index] ={
            clef: exercise.clef,
            time_signature: exercise.time_signature,
            notes: exercise.notes
        }
    }

    return exercises
}

const exercises = generateExercises()
const json = JSON.stringify(exercises, null, 2)

const path = './src/exercises/exercises.json'
fs.writeFile(path, json, 'utf8', (err) => {
    if (err) {
        console.error('An error occurred while writing JSON to file')
    } else {
        console.log('JSON file has been saved')
    }
})