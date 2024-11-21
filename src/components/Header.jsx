import '../styles/Header.css'

const Header = () => (
    <header>
        <div style={{ display: "flex" }}>
          <h1 id="title" style={{ fontSize: "36px" }}><a href="../../index.html" style={{}}>Aural Skills Training</a></h1>
          <div id="menu-bar" style={{ display: "flex" }}>
            <a href="../../about.html">About</a>
            <a href="">GitHub</a>
          </div>
        </div>
    </header>
)

export default Header