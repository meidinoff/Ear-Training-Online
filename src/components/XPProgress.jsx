import { useState, useEffect } from 'react'
import '../styles/XPProgress.css'

const XPProgress = ({ correct }) => {
    const [userLevel, setUserLevel] = useState(1)
    const [userXP, setUserXP] = useState(0)
    const [levelUpXP, setLevelUpXP] = useState(50)
    const [xpIncrement, setXPIncrement] = useState(10)

    useEffect(() => {
        const levelContainer = document.querySelector(".levelContainer")
        
        if (correct) {
            levelContainer.style.display = "block"
            setUserXP(userXP + xpIncrement)
            console.log("user XP", userXP)
        } else {
            levelContainer.style.display = "none"
        }
    }, [correct])

    useEffect(() => {
        const xpFill = document.querySelector(".xpFill")
        xpFill.style.right = `${100 - ((userXP/levelUpXP) * 100)}%`

        if (userXP >= levelUpXP) {
            console.log("triggered condition!")
            setTimeout(() => {
                console.log("did timeout!")
                setUserLevel(userLevel + 1)
                setUserXP(0)
                setXPIncrement(xpIncrement + xpIncrement/10)
                setLevelUpXP(levelUpXP + 20)
            }, 2000)
        }
    }, [userXP])

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