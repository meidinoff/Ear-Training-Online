import '../styles/Header.css'

const Header = () => (
    <header>
        <div style={{ display: "flex" }}>
          <h1 id="title" style={{ fontSize: "36px" }}><a href="/Ear-Training-Online/" style={{}}>Ear Training Online</a></h1>
          <div id="menu-bar" style={{ display: "flex" }}>
            <a href="/Ear-Training-Online/about">About</a>
            <a href="https://github.com/meidinoff/Ear-Training-Online">GitHub</a>
          </div>
        </div>
    </header>
)

export default Header