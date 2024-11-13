import { useState, useEffect } from 'react'
import { setDifficulty } from '../utils/chooseExercise'
import '../styles/XPProgress.css'

const XPProgress = ({ correct, addingXP, setAddingXP }) => {
    const [userLevel, setUserLevel] = useState(1)
    const [userXP, setUserXP] = useState(0)
    const [levelUpXP, setLevelUpXP] = useState(50)
    const [xpIncrement, setXPIncrement] = useState(10)
    const [transitionSpeed, setTransitionSpeed] = useState(xpIncrement * 0.015)

    useEffect(() => {
        const levelContainer = document.querySelector(".levelContainer")
        
        if (correct && !addingXP) {
            levelContainer.style.display = "block"
            setAddingXP(true)
            addXP(xpIncrement)
        } else if (!correct) {
            levelContainer.style.display = "none"
        }
    }, [correct])

    useEffect(() => {
        const xpFill = document.querySelector(".xpFill")
        xpFill.style.transition = `right ${transitionSpeed}s ease-in-out`
        xpFill.style.right = `${100 - ((userXP/levelUpXP) * 100)}%`
    }, [userXP, levelUpXP])

    useEffect(() => {
        setDifficulty(userLevel)
    }, [userLevel])

    const addXP = (remainingXP) => {
        if (remainingXP <= 0) {
            setAddingXP(false)
            return
        }

        setUserXP(prevUserXP => {
            let newXP = prevUserXP + 1
            if (newXP >= levelUpXP) {
                setUserLevel(userLevel => userLevel + 1)
                setXPIncrement(xpIncrement => xpIncrement + xpIncrement / 10)
                setLevelUpXP(levelUpXP => levelUpXP + 20)

                setTransitionSpeed(0.1)
                newXP = 0

                setTimeout(() => {
                    setTransitionSpeed(xpIncrement * 0.015)
                }, 2000)
            }

            // Add sound effects

            setTimeout(() => addXP(remainingXP - 1), ((transitionSpeed * 1000) / xpIncrement) * 8)
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