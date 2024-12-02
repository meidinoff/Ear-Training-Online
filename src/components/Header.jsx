import '../styles/Header.css'
import { Link } from 'react-router-dom'

const Header = () => (
    <header>
        <div style={{ display: "flex" }}>
          <h1 id="title" style={{ fontSize: "36px" }}><Link to="/" style={{ textDecoration: 'none' }}>Ear Training Online</Link></h1>
          <div id="menu-bar" style={{ display: "flex" }}>
            <Link to="/about">About</Link>
            <a href="https://github.com/meidinoff/Ear-Training-Online" target="_blank" rel="noreferrer noopener">GitHub</a>
          </div>
        </div>
    </header>
)

export default Header