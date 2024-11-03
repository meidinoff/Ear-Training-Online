

const Header = () => {
    const headerStyle = {
        display: "block",
        alignItems: "stretch",
        textAlign: "center",
        margin: "0",
        width: "100%",
        position: "absolute",
        left: "0px",
        right: "0px",
        top: "0px",
        padding: "10px 0",
        backgroundColor: "purple"
    }

    const linkStyle = {
        fontSize: "22px",
        columnGap: "10px"
    }

    return (
        <div style={headerStyle}>
            <header>
                <div style={{ display: "flex" }}>
                    <h1 style={{ fontSize: "36px" }}>Aural Skills Training</h1>
                    <div style={{ display: "flex" }}>
                        <a style={linkStyle} href="">About</a>
                        <a style={linkStyle} href="">GitHub</a>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header