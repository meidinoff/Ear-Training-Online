import { useState, useEffect } from 'react'

const XPProgress = ({ correct }) => {
    const [userLevel, setUserLevel] = useState(1)
    const [userXP, setUserXP] = useState(0)
    const [levelUpXP, setLevelUpXP] = useState(50)
    const [xpIncrement, setXPIncrement] = useState(10)

    useEffect(() => {
        const progressBar = document.querySelector(".progressBar")
        
        if (correct) {
            progressBar.style.display = "block"
            setUserXP(userXP + xpIncrement)
        } else {
            progressBar.style.display = "none"
        }

        if (userXP >= levelUpXP) {
            setUserLevel(userLevel + 1)
            setUserXP(0)
            setXPIncrement(xpIncrement + xpIncrement/10)
            setLevelUpXP(levelUpXP + 20)
        }
    }, [correct])

    useEffect(() => {
        const xpFill = document.querySelector(".xpFill")
        xpFill.style.right = `${100 - ((userXP/levelUpXP) * 100)}%`
    }, [userXP])

    const containerStyle ={
        display: "block",
        marginTop: "40px",
        height: "20px"
    }
    
    const barStyle = {
        display: "none",
        position: "relative",
        xIndex: "1",
        backgroundColor: "lightgrey",
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        border: "2px solid black"
    }

    const fillStyle = {
        position: "absolute",
        zIndex: "2",
        top: "0",
        bottom: "0",
        left: "0",
        right: "100%",
        backgroundColor: "gold",
        borderRadius: "20px",
        transition: "right 2s ease-in-out"
    }

    const xpStyle = {
        position: "absolute",
        zIndex: "3",
        left: "0",
        right: "0",
        margin: "0",
        height: "20px",
        fontWeight: "bold"
    }

    return (
        <div style={containerStyle}>
            <p style={{ fontWeight: "bold", margin: "0 auto 10px" }}>Level {userLevel}</p>
            <div className='progressBar' style={barStyle}>
                <div className='xpFill' style={fillStyle}></div>
                <p style={xpStyle}>{userXP}/{levelUpXP}</p>
            </div>
        </div>
    )
}

export default XPProgress