import { useState, useEffect } from 'react'
import { setDifficulty } from '../utils/chooseExercise'
import '../styles/XPProgress.css'

const XPProgress = ({ isCorrect, isAddingXP, setIsAddingXP }) => {
    const [userLevel, setUserLevel] = useState(1)
    const [userXP, setUserXP] = useState(0)
    const [levelUpXP, setLevelUpXP] = useState(50)
    const [templateXPIncrement, setTemplateXPIncrement] = useState(10) // Amount of XP the user gains for correctly answering the question the 1st time
    const [actualXPIncrement, setActualXPIncrement] = useState(templateXPIncrement) // XP the user actually gains (decreases if user is incorrect)
    const [transitionSpeed, setTransitionSpeed] = useState(templateXPIncrement * 0.015) // Animation duration

    useEffect(() => {
        // Select XP progress bar and only make visible after getting an answer correct
        const levelContainer = document.querySelector(".levelContainer")
        
        if (isCorrect && !isAddingXP) {
            levelContainer.style.display = "block"
            setIsAddingXP(true)
            setActualXPIncrement(templateXPIncrement)
            addXP(actualXPIncrement)
        } else if (!isCorrect && isCorrect !== null) {
            setActualXPIncrement(templateXPIncrement / 2)
        } else if (!isCorrect) {
            levelContainer.style.display = "none"
        }
    }, [isCorrect])

    useEffect(() => {
        // Activate XP fill animation
        const xpFill = document.querySelector(".xpFill")
        xpFill.style.transition = `right ${transitionSpeed}s ease-in-out`
        xpFill.style.right = `${100 - ((userXP/levelUpXP) * 100)}%`
    }, [userXP, levelUpXP])

    useEffect(() => {
        // Increase difficulty every time user levels up
        setDifficulty(userLevel)
    }, [userLevel])

    const addXP = (remainingXP) => {
        // Stop looping this function when all necessary XP has been added to progress bar
        if (remainingXP <= 0) {
            setIsAddingXP(false)
            return
        }
        
        setUserXP(prevUserXP => {
            // Repeatedly add 1XP so that the conditional below can check if it is time for level up
            let newXP = prevUserXP + 1

            // Check if it is time to level up
            if (newXP >= levelUpXP) {
                // Increase level, XP acquired for each correct answer, and XP needed to level up again
                setUserLevel(userLevel => userLevel + 1)
                setTemplateXPIncrement(templateXPIncrement => templateXPIncrement + templateXPIncrement / 10)
                setLevelUpXP(levelUpXP => levelUpXP + 20)

                // Make transition from full bar to 0 nearly instant
                setTransitionSpeed(0.1)
                newXP = 0

                // Reset transition speed
                setTimeout(() => {
                    setTransitionSpeed(templateXPIncrement * 0.015)
                }, 2000)
            }

            // Recursively loop function after animation finished until all XP has been added
            setTimeout(() => addXP(remainingXP - 1), ((transitionSpeed * 1000) / templateXPIncrement) * 8)
            return newXP
        })
    }

    return (
        <div className='levelContainer'>
            <p className='levelText'>Level {userLevel}</p>
            <div className='progressBar'>
                <div className='xpFill'></div>
                <p className='xpText'>{userXP}/{levelUpXP}</p>
            </div>
        </div>
    )
}

export default XPProgress