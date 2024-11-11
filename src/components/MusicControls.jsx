

const MusicControls = ({ answered, setAccidental, setRedraw }) => {

    const containerStyle = {
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: "5px"
    }

    const buttonStyle = {
        flexGrow: "1"
    }

    const chooseAccidental = (accidental) => {
        console.log("accidental: ", accidental)

        if (answered) {
            setAccidental(accidental)
            setRedraw(true)
        } else {
            setAccidental(accidental)
        }
    }

    return (
        <div style={containerStyle}>
            <button style={buttonStyle} type="button" value="double sharp" onClick={({ target }) => chooseAccidental(target.value)}>𝄪</button>
            <button style={buttonStyle} type="button" value="sharp" onClick={({ target }) => chooseAccidental(target.value)}>#</button>
            <button style={buttonStyle} type="button" value="natural" onClick={({ target }) => chooseAccidental(target.value)}>♮</button>
            <button style={buttonStyle} type="button" value="flat" onClick={({ target }) => chooseAccidental(target.value)}>♭</button>
            <button style={buttonStyle} type="button" value="double flat" onClick={({ target }) => chooseAccidental(target.value)}>𝄫</button>
        </div>
    )
}

export default MusicControls